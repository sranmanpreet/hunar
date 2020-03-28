export class Address {
    constructor(
        public firstName: string,
        public lastName: string,
        public addressLine1: string,
        public city: string,
        public state: string,
        public country: string,
        public postalCode: string,
        public phone: string,
        public addressLine2?: string,
        public email?: string,
        public _id?: string
    ) { }
}
