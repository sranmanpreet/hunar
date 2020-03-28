import { Product } from '../shared/models/product.model';

export class Gallery {
    public images: Product[];

    constructor(images: Product[]) {
        this.images = images;
    }
}