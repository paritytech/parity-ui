// Copyright 2015, 2016 Ethcore (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

use std::fmt;
use std::process::{Command, Stdio};

#[cfg(not(windows))]
static NPM_CMD: &'static str = "npm";
#[cfg(windows)]
static NPM_CMD: &'static str = "npm.cmd";

fn die<T : fmt::Debug>(s: &'static str, e: T) -> ! {
	panic!("Error: {}: {:?}", s, e);
}


// NOTE [ToDr] For some reason on windows
// We cannot have any file descriptors open when running a child process
// during build phase.
#[cfg(windows)]
fn handle_fd(cmd: &mut Command) -> &mut Command {
	cmd.stdin(Stdio::null())
		.stdout(Stdio::null())
		.stderr(Stdio::null())
}

#[cfg(not(windows))]
fn handle_fd(cmd: &mut Command) -> &mut Command {
	cmd
}

pub fn build(path: &str) {
	let child = handle_fd(&mut Command::new(NPM_CMD))
		.arg("install")
		.arg("--no-progress")
		.current_dir(path)
		.status()
		.unwrap_or_else(|e| die("Installing dependencies", e));
	assert!(child.success(), "There was an error installing dependencies.");

	let child = handle_fd(&mut Command::new(NPM_CMD))
		.arg("run")
		.arg("build")
		.env("NODE_ENV", "production")
		.current_dir(path)
		.status()
		.unwrap_or_else(|e| die("Building JS code", e));
	assert!(child.success(), "There was an error build JS code.");
}

pub fn test(path: &str) {
	let child = Command::new(NPM_CMD)
		.arg("run")
		.arg("test")
		.current_dir(path)
		.status()
		.unwrap_or_else(|e| die("Running test command", e));
	assert!(child.success(), "There was an error while running JS tests.");
}
