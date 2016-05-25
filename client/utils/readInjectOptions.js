export default function readInjectOptions () {
  const script = document.head.querySelector('script[src*="inject.js"]');

  if (!script) {
    console.warn('Could not detect script options. Falling back to defaults.');
    return {
      allAccounts: false
    };
  }

  return {
    allAccounts: script.hasAttribute('all-accounts'),
    customStyle: script.getAttribute('custom-style')
  };
}
