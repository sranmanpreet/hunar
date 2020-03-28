import { Address } from './address.model';
import { CartItem } from '../../shopping/cart-item.model';

export class Order {
    constructor(
        public orderItems: [{
            price: number,
            quantity: number,
            productType: string,
            name: string,
            imgurl: string,
            artType: string,
            artSize: string,
            _id?: string
        }],
        public subtotal: number,
        public shippingCost: number,
        public tax: number,
        public total: number,
        public shippingAddressId: string,
        public billingAddressId: string,
        public date?: Date,
        public status?: string,
        public email?: string,
        public deliveryDate?: Date,
        public paymentMethod?: string,
        public paymentReferenceId?: string,
        public _id?: string,
        public _v?: string,
    ) { }
}
