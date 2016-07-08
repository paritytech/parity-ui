
export default function fetchApps () {
  return window.fetch('/api/apps', {
    credentials: 'same-origin'
  })
    .then(res => res.json())
    .then(apps => filterApps(apps));
}

function filterApps (apps) {
  // We are going to filter apps with the same
  // names, versions and descriptions.
  // We are also getting rid of `home.parity` app.

  const known = {};
  return apps.filter(app => {
    const uid = app.name + app.version + app.description;

    if (app.id === 'home') {
      return false;
    }

    if (known[uid]) {
      known[uid].ids.push(app.id);
      return false;
    }

    known[uid] = app;
    app.ids = [app.id];
    return true;
  });
}

