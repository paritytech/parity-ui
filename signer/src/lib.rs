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

extern crate parity_dapps;

pub struct File {
	pub content: String,
	pub mime: String,
}

#[inline]
fn file(content: &str, mime: &str) -> Option<File> {
	Some(File {
		content: content.into(),
		mime: mime.into()
	})
}

pub fn handle(resource: &str) -> Option<File> {
	match resource {
		"/" | "/index.html" => file(include_str!("./web/index.html"), "text/html"),
		"/index.js" => file(include_str!("./web/index.js"), "application/javascript"),
		"/app.js" => file(include_str!("./web/app.js"), "application/javascript"),
		"/styles.css" => file(include_str!("../../home/src/web/styles.css"), "text/css"),
		_ => None,
	}
}

#[test]
fn test_js() {
	::parity_dapps::js::test(concat!(env!("CARGO_MANIFEST_DIR"), "/web"))
}

