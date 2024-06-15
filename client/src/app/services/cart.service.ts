import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private LOCAL_STORAGE_CART: string = 'cart';
    private localStorage: any;

    public cart: any;
    public cartTotal: number = 0;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.localStorage = document.defaultView?.localStorage;
    }

    public loadCart(): void {
        const infoCart = this.localStorage?.getItem(this.LOCAL_STORAGE_CART);
        this.cart = infoCart ? JSON.parse(infoCart) : [];
        this.updateCartTotal();
    }

    public updateCart(products: any[]): void {
        this.localStorage?.setItem(this.LOCAL_STORAGE_CART, JSON.stringify(products));
        this.loadCart()
    }

    updateCartTotal(): void {
        this.cartTotal = this.cart?.reduce((a: number, b: any) => a + b.quantity_purchased, 0) || 0;
    }

    public addProductToCart(item: any): void {
        const products = this.cart.filter((x: any) => x.id === item.id);
        if (products.length === 0) {
            const { ...data } = item;
            const product = data;
            this.cart.push(product);
        }
        else {
            const product = products[0];
            product.quantity_purchased += item.quantity_purchased;
            product.quantity_purchased = Math.min(product.quantity_purchased, product.quantity);
        }

        this.updateCart(this.cart);
    }

}