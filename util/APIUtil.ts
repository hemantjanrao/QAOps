import { expect, APIRequestContext } from '@playwright/test';

export class APIUtil {
    private token?: string;

    constructor(
        private readonly request: APIRequestContext,
        private readonly authPayload: { userEmail: string; userPassword: string },
    ) {}

    async getToken(): Promise<string> {
        const response = await this.request.post('/api/ecom/auth/login', {
            data: this.authPayload,
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        this.token = data.token;
        return this.token as string;
    }

    async getProductIdByName(productName: string): Promise<string> {
        if (!this.token) {
            await this.getToken();
        }

        const response = await this.request.post('/api/ecom/product/get-all-products', {
            data: {
                productName: '',
                minPrice: null,
                maxPrice: null,
                productCategory: [],
                productSubCategory: [],
                productFor: [],
            },
            headers: this.getAuthHeaders(),
        });
        expect(response.status()).toBe(200);

        const { data: products } = await response.json();
        const product = products.find((p: { productName: string }) =>
            p.productName.includes(productName),
        );
        expect(product, `Product not found: ${productName}`).toBeTruthy();
        return product._id;
    }

    async createOrder(orderPayload: {
        orders: { country: string; productOrderedId: string }[];
    }): Promise<string> {
        if (!this.token) {
            await this.getToken();
        }

        const orderResponse = await this.request.post('/api/ecom/order/create-order', {
            data: orderPayload,
            headers: this.getAuthHeaders(),
        });
        expect(orderResponse.status()).toBe(201);

        const orderData = await orderResponse.json();
        return orderData.orders[0];
    }

    private getAuthHeaders(): Record<string, string> {
        if (!this.token) {
            throw new Error('Token missing. Call getToken() first.');
        }
        return { Authorization: this.token };
    }
}
