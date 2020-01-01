import { CartItem } from './cart-item.model';

export class Cart {
    constructor(
        public _id: string,
        public cartItems: [CartItem],
        public subtotal: number,
        public shippingCost: number,
        public tax: number,
        public total: number,
        _v: string) { }
}
