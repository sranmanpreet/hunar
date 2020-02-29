export class CartItem {
    constructor(
        public price: number,
        public quantity: number,
        public _id: string,
        public productType: string,
        public name: string,
        public imgurl: string,
        public artType: string,
        public artSize: string
    ) { }
}
