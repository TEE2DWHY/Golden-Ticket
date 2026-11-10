export type Inventory = {
    _id: string;
    name: string;
    quantity: number;
    price: number;
};

export type Receipt = {
    message: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    remainingQuantity: number;
};
