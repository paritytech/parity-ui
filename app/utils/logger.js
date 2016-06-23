// this module disable logging on prod

const isLogging = process.env.LOGGING;

export default logger();

function logger () {
  return isLogging ? prodLogger() : devLogger();
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
