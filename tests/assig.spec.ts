import { test, expect } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_EVENTS = '**/api/events**';

const TEST_USER = {
    email: 'hemantjanrao@gmail.com',
    password: '@Test1234',
};

const SIX_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
        { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
        { id: 6, title: 'AI & ML Expo', category: 'Conference', eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Ctr', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};


test.describe('Assignment 1 — Events listing', () => {

    test('renders the mocked events response', async ({ page }) => {

        await page.goto(`${BASE_URL}/login`);
        await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
        await page.getByRole('textbox', { name: 'Password' }).fill(TEST_USER.password);
        await Promise.all([
            page.waitForURL(`${BASE_URL}/`),
            page.getByRole('button', { name: 'Sign In' }).click(),
        ]);

        await page.route(API_EVENTS, (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(SIX_EVENTS_RESPONSE),
            }),
        );

        const eventsResponse = page.waitForResponse(
            (res) => res.url().includes('/api/events') && res.status() === 200,
        );
        await page.goto(`${BASE_URL}/events`);
        const body = await (await eventsResponse).json();

        expect(body.data).toHaveLength(SIX_EVENTS_RESPONSE.data.length);
        expect(body.pagination.total).toBe(SIX_EVENTS_RESPONSE.pagination.total);

        // UI assertion — verify the page actually rendered what we mocked.
        // Adjust the selector to match the real card; this is the resilient pattern:
        for (const event of SIX_EVENTS_RESPONSE.data) {
            await expect(page.getByText(event.title)).toBeVisible();
        }
    });
});