export function parseAddress(url) {
  const parts = url.split('://');
  const protocol = parts[0];

  if (parts.length === 1) {
    return {
      protocol: 'local',
      url: parts
    };
  }
  
  if (protocol === 'local') {
    return {
      protocol,
      url: parts[1]
    };
  }

  if (protocol === 'parity' || protocol === 'ipfs') {
    const p = parts[1].split('/');
    return {
      protocol,
      url: `http://${p[0]}.${protocol}/${p.slice(1).join('/')}`
    };
  }

  return {
    protocol,
    url
  };
}
