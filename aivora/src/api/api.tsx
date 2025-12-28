import data from './data.json';
import { FALLBACK_IMAGE } from '../utils/imageUtils';

export interface ProductItem {
  id: number;
  proImg: string;
  title: string;
  slug: string;
  price: string;
  delPrice: string;
  brand: string;
  stock: string;
  size: string;
}

const getData = (): ProductItem[] => {
  return (data as ProductItem[]).map((item) => ({
    ...item,
    proImg: item.proImg && item.proImg.trim() ? item.proImg : FALLBACK_IMAGE,
  }));
};

export const getProductById = (id: number): ProductItem | undefined => {
  return getData().find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): ProductItem[] => {
  return getData().filter((product) => product.brand === category);
};

export default getData;
