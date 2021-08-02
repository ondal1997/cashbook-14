import { $router } from '@/core/router';
import axios from 'axios';

export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const hexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;

export const returnPrice = (price: number) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const checkLogin = (data: { message: string }) => {
  if (data.message === 'forbidden') $router.push('/login');
};

export const fetchWrap = async ({
  method,
  url,
  params,
  body,
}: {
  method: 'get' | 'post' | 'delete';
  url: string;
  params?: {};
  body?: {};
}) => {
  try {
    const config = {
      baseURL: 'http://localhost:3000/api',
      withCredentials: true,
      params,
    };
    const { data } =
      (method === 'get' && (await axios.get(url, config))) ||
      (method === 'post' && (await axios.post(url, body, config))) ||
      (method === 'delete' && (await axios.delete(url, config))) ||
      {};
    checkLogin(data);
    return data;
  } catch (error) {
    return error;
  }
};
