// this module disable logging on prod

const isProd = process.env.NODE_ENV === 'production';

export default logger();

function logger () {
  return isProd ? prodLogger() : devLogger();
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
