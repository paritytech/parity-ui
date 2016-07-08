// this module disable logging on prod

const isDev = process.env.NODE_ENV === 'development';

export default logger();

function logger () {
  return isDev ? devLogger() : prodLogger();
}

function prodLogger () {
  return {
    log: noop,
    info: noop,
    error: noop,
    warn: noop
  };
}

function devLogger () {
  return console;
}

function noop () {}
