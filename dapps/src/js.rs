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
use std::process::Command;

fn die<T : fmt::Debug>(s: &'static str, e: T) -> ! {
	panic!("Error: {}: {:?}", s, e);
}

pub fn build(path: &str) {
	let mut child = Command::new("npm")
		.arg("install")
		.current_dir(path)
		.spawn()
		.unwrap_or_else(|e| die("Installing dependencies", e));
	let code = child.wait().unwrap_or_else(|e| die("Installing dependencies", e));
	assert!(code.success());

	let mut child = Command::new("npm")
		.arg("run")
		.arg("build")
		.env("NODE_ENV", "production")
		.current_dir(path)
		.spawn()
		.unwrap_or_else(|e| die("Building JS code", e));
	let code = child.wait().unwrap_or_else(|e| die("Building JS code", e));
	assert!(code.success());
}

pub fn test(path: &str) {
	use std::process::Command;
	let mut child = Command::new("npm")
		.arg("run")
		.arg("test")
		.current_dir(path)
		.spawn().unwrap_or_else(|e| die("Running test command", e));
	let code = child.wait().unwrap_or_else(|e| die("Testing JS code", e));
	assert!(code.success());
}
