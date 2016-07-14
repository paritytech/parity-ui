export function fixAccountNames (names, accounts) {
  const copy = Object.assign({}, names);
  return accounts.reduce((memo, acc, idx) => {
    memo[acc] = names[acc] || `Account ${idx + 1}`;
    return memo;
  }, copy);
}
