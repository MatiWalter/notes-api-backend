// Test unitario
const { palindrome } = require('../utils/forTesting');

test.skip('should return a palindrome', () => {
  const result = palindrome('matias');

  expect(result).toBe('saitam');
});

test.skip('should return undefined if receive an undefined', () => {
  const result = palindrome();

  expect(result).toBeUndefined();
});
