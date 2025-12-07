export interface IShippingAddress {
  id: string;
  city: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
    shippingPrice: number;
  };
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
