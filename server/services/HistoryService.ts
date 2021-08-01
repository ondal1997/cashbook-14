import { getRepository } from 'typeorm';
import { History } from '../models/history';

// TODO: 필드 유효성 확인 (서비스에서 하는게 맞는듯)
// 타입이 카테고리의 것과 같은가?
// 본인의 카테고리인가?
// 본인의 결제수단인가?
// ...

async function findHistory({ id }: { id: string }) {
  const repo = getRepository(History);

  const result = await repo.findOne({
    where: { id },
    relations: ['category', 'payment', 'user'],
  });
  return result;
}

async function findHistories({
  userId,
  categoryId,
  type,
  start,
  last,
  order,
}: {
  userId?: number;
  categoryId?: number;
  type?: string;
  start?: { year: number; month: number };
  last?: { year: number; month: number };
  order?: string;
}) {
  const repo = getRepository(History);

  let result = await repo.find({
    where: {
      ...(userId && { user: { id: userId } }),
      ...(categoryId && { category: { id: categoryId } }),
      ...(type && { type }),
    },
    relations: ['category', 'payment', 'user'],
  });

  // TODO: 필터링 개선(DB 수준에서의 필터링을 구현하기) 근데 쿼리 작성하기 귀찮다... ㅎㅎ
  if (start) {
    result = result.filter((history) => {
      const cmpFullYear = new Date(history.date).getFullYear() - start.year;
      const cmpMonth = new Date(history.date).getMonth() - start.month;
      return cmpFullYear > 0 || (cmpFullYear === 0 && cmpMonth >= 0);
    });
  }
  if (last) {
    result = result.filter((history) => {
      const cmpFullYear = new Date(history.date).getFullYear() - last.year;
      const cmpMonth = new Date(history.date).getMonth() - last.month;
      return cmpFullYear < 0 || (cmpFullYear === 0 && cmpMonth <= 0);
    });
  }

  if (order === 'ASC') {
    // 오름차
    result = result.sort((a, b) => {
      return a.id - b.id;
    });
  } else {
    result = result.sort((a, b) => {
      return b.id - a.id;
    });
  }

  return result;
}

async function getSumOfAmountsGroupByMonth({
  userId,
  categoryId,
  type,
  start,
  last,
}: {
  userId?: number;
  categoryId?: number;
  type?: string;
  start: { year: number; month: number };
  last: { year: number; month: number };
}) {
  let histories = await findHistories({
    ...(userId && { userId }),
    ...(categoryId && { categoryId }),
    ...(type && { type }),
    start,
    last,
  });

  // 그룹화
  const startValue = start.year * 12 + start.month;
  const lastValue = last.year * 12 + last.month;
  const result: number[] = Array.from(
    { length: lastValue - startValue + 1 },
    () => 0
  );
  histories.forEach((history) => {
    const group =
      new Date(history.date).getFullYear() * 12 +
      new Date(history.date).getMonth();
    result[group - startValue] +=
      +history.amount * (history.paymentType === 'outcome' ? -1 : 1);
  });

  return result;
}

async function createHistory({
  userId,
  paymentId,
  categoryId,
  date,
  paymentType,
  content,
  amount,
}: {
  userId: number;
  paymentId?: number | null;
  categoryId?: number | null;
  date: string;
  paymentType: string;
  content: string;
  amount: number;
}) {
  const repo = getRepository(History);

  const history = repo.create({
    date,
    paymentType,
    content,
    amount,
    user: { id: userId },
    ...(paymentId && { payment: { id: paymentId } }),
    ...(categoryId && { category: { id: categoryId } }),
  });

  const result = await repo.insert(history);
  return result;
}

async function updateHistory(
  { id, userId }: { id: number; userId?: number },
  {
    paymentId,
    categoryId,
    date,
    type,
    content,
    amount,
  }: {
    paymentId?: number | null;
    categoryId?: number | null;
    date?: string;
    type?: string;
    content?: string;
    amount?: number;
  }
) {
  const repo = getRepository(History);

  const result = await repo.update(
    { id, ...(userId && { user: { id: userId } }) },
    {
      ...(paymentId && { payment: { id: paymentId } }),
      ...(categoryId && { category: { id: categoryId } }),
      ...(date && { date }),
      ...(content && { content }),
      ...(amount && { amount }),
      ...(type && { type }),
    }
  );
  return result;
}

async function deleteHistory({ id, userId }: { id: number; userId?: number }) {
  const repo = getRepository(History);

  const result = await repo.delete({
    id,
    ...(userId && { user: { id: userId } }),
  });
  return result;
}

export const HistoryService = {
  findHistory,
  findHistories,
  createHistory,
  updateHistory,
  deleteHistory,
  getSumOfAmountsGroupByMonth,
};
