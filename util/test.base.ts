import { test as base, expect } from '@playwright/test';

type TestData = {
    productName: string;
    country: string;
};

type MyFixtures = {
    testData: TestData;
};

export const test = base.extend<MyFixtures>({
    testData: async ({}, use) => {
        await use({
            productName: 'ZARA COAT 3',
            country: 'India',
        });
    },
});

module.exports = { test };
