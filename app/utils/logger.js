const isProd = process.env.NODE_ENV === 'production';

const prodConsole = {
	log: noop,
	info: noop,
	error: noop,
	warn: noop
}

global.console = isProd ? prodConsole : console;

function noop () {}
