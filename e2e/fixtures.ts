import { test as base, expect } from '@playwright/test';

// Extend the base test with a fixture that provides a fresh page and optional storage state.
export const test = base.extend({
  // Example of a fixture that could load authentication state.
  // storageState: async ({}, use) => {
  //   await use('playwright/.auth/storageState.json');
  // },
});

export { expect };
