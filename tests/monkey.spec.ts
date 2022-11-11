import { test } from '@playwright/test';
 
const { describe, beforeEach, expect } = test;
let errors = 0;

describe.only('Monkey test', () => {
	beforeEach(async ({ page }) => {
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				console.log(`🐟`, msg);
				errors++;
			}
		});

		page.on('popup', (newPage) => {
			newPage.close();
		});

		await page.addInitScript({
			path: './node_modules/gremlins.js/dist/gremlins.min.js',
		});

		await page.goto('https://demo.microfrontends.com/', {
			waitUntil: 'domcontentloaded',
		});
	});

	test('should fail if there are 10 or more errors logged', async ({
		page,
	}) => {
		await page.evaluateHandle(() => {
			return gremlins
				.createHorde({
					randomizer: new gremlins.Chance(1234), 
					strategies: [gremlins.strategies.allTogether({ nb: 100 })],
				})
				.unleash();
		});

		expect(errors).toBeLessThanOrEqual(9);
		console.log('errors ' + errors);
	});
});
