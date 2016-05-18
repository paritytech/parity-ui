
const SUBDOMAIN = '.parity';

export function appLink (appId) {
  if (isUsingSubdomains()) {
    return `//${appId}${SUBDOMAIN}/`;
  }

  return `/${appId}/`;
}

export function isUsingSubdomains () {
  const matches = window.location.toString().match(new RegExp(`${SUBDOMAIN}$`, 'i'));
  return !!matches;
}
