export function getProxyPacLocation () {
  const { host, protocol } = window.location;
  return `${protocol}//${host}/proxy/proxy.pac`;
}
