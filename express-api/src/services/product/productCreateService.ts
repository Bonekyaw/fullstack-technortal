type ProductProps = {
  name: string;
  description: string;
  price: number;
  discount: number;
  inventory: number;
  category: string;
  type: string;
  files: any;
};
export const productCreateService = async (product: ProductProps) => {
  const {
    name,
    description,
    price,
    discount,
    inventory,
    category,
    type,
    files,
  } = product;
};
