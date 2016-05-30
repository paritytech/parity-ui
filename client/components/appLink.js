
const SUBDOMAIN = '.parity';
const CURRENT_APP_NAME = getAppFromWindow();

export function appLink (appId) {
  if (isUsingSubdomains()) {
    return appSubdomainLink(appId);
  }

  return `/${appId}/`;
}

function appSubdomainLink (appId) {
  return `${window.location.protocol}//${appId}${SUBDOMAIN}/`;
}

export function appPrettyLink () {
  return appSubdomainLink(CURRENT_APP_NAME);
}

function getAppFromWindow () {
  return window.location.pathname.replace(/\//g, '');
}

export function isUsingSubdomains () {
  const host = window.location.host.toString();
  const len = host.length;
  return host.indexOf(SUBDOMAIN) === len - SUBDOMAIN.length;
}
