
const SUBDOMAIN = '.parity';

export function appLink (appId) {
  if (isUsingSubdomains()) {
    return `//${appId}${SUBDOMAIN}/`;
  }

  return `/${appId}/`;
}

export function appPrettyLink () {
  return window.location.protocol + '://' + getAppFromWindow() + SUBDOMAIN;
}

function getAppFromWindow () {
  return window.location.pathname.replace(/\//g, '');
}

export function isUsingSubdomains () {
  const host = window.location.host.toString();
  const len = host.length;
  return host.indexOf(SUBDOMAIN) === len - SUBDOMAIN.length;
}
