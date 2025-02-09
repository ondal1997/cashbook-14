import { drop } from '@/../assets';
import Component, { PropsType } from '@/core/Component';
import jsx from '@/core/jsx';
import { historyInputState, userState } from '@/Model';
import { HistoryInputType } from '@/shared/type';
import { getState, setState, subscribe } from '@/core/observer';
import DropDown from '@/Components/molecule/Dropdown';
import './style';

interface InpuBarSelectState {
  isOpened: boolean;
}

class InputBarSelect extends Component<PropsType, InpuBarSelectState> {
  $dropdown: Element = jsx``;

  constructor(props: PropsType) {
    super(props);

    this.state = {
      isOpened: false,
    };

    this.setDom();
  }

  render() {
    return jsx``;
  }
}

export class CategorySelect extends InputBarSelect {
  $dropdown: Element = jsx``;

  constructor(props: PropsType) {
    super(props);

    subscribe(
      userState.myIncomeCategories,
      'input-bar-incomecategories',
      this.update.bind(this)
    );
    subscribe(
      userState.myOutcomeCategories,
      'input-bar-outcomecategories',
      this.update.bind(this)
    );
    subscribe(historyInputState, 'category-select', this.update.bind(this));
  }

  willUpdate() {
    const handleSetState = setState(historyInputState);

    const { paymentType } = getState(historyInputState) as HistoryInputType;

    this.$dropdown = new DropDown({
      selectType:
        paymentType === 'income' ? 'incomeCategory' : 'outcomeCategory',
      setContent: (category: { id: number; name: string }) => {
        this.state.isOpened = false;
        handleSetState((oldState: HistoryInputType) => {
          return { ...oldState, category };
        });
      },
      paymentType,
    }).$dom;
  }

  render() {
    const { isOpened } = this.state;

    const handleOpen = () => {
      this.setState({ isOpened: !this.state.isOpened });
    };

    const content = (getState(historyInputState) as HistoryInputType).category
      .name;

    return jsx`
      <div class='select${content ? '' : ' none'}' onClick=${handleOpen}>
        ${content || '선택하세요'}
        <img class='drop-icon' src=${drop} style='transform: ${
      isOpened ? 'rotate(180deg)' : ''
    }' />
        ${isOpened ? this.$dropdown : ''}
      </div>
    `;
  }
}

export class PaymentSelect extends InputBarSelect {
  $dropdown: Element = jsx``;

  constructor(props: PropsType) {
    super(props);

    subscribe(
      userState.myPayments,
      'input-bar-payments',
      this.update.bind(this)
    );
    subscribe(historyInputState, 'payment-select', this.update.bind(this));
  }

  willUpdate() {
    const handleSetState = setState(historyInputState);

    this.$dropdown = new DropDown({
      selectType: 'payment',
      setContent: (payment: { id: number; name: string }) => {
        this.state.isOpened = false;
        handleSetState((oldState: HistoryInputType) => {
          return { ...oldState, payment };
        });
      },
    }).$dom;
  }

  render() {
    const { isOpened } = this.state;

    const handleOpen = () => {
      this.setState({ isOpened: !this.state.isOpened });
    };

    const content = (getState(historyInputState) as HistoryInputType).payment
      .name;

    return jsx`
      <div class='select${content ? '' : ' none'}' onClick=${handleOpen}>
        ${content || '선택하세요'}
        <img class='drop-icon' src=${drop} style='transform: ${
      isOpened ? 'rotate(180deg)' : ''
    }' />
        ${isOpened ? this.$dropdown : ''}
      </div>
    `;
  }
}
