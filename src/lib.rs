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

pub struct File {
  pub content: String,
  pub mime: String,
  pub safe_to_embed: bool,
}

#[inline]
fn file(content: &str, mime: &str) -> Option<File> {
  Some(File {
    content: content.into(),
    mime: mime.into(),
    safe_to_embed: false,
  })
}

pub fn handle(resource: &str) -> Option<File> {
  match resource {
    "/" | "/index.html" => file(include_str!("./web/index.html"), "text/html"),
    "/favicon.ico" => file("", "image/ico"),
    "/index.js" => file(include_str!("./web/index.js"), "application/javascript"),
    "/preact.js" => file(include_str!("./web/preact.js"), "application/javascript"),
    "/sha3.min.js" => file(include_str!("./web/sha3.min.js"), "application/javascript"),
    "/milligram.css" => file(include_str!("./web/milligram.css"), "text/css"),
    "/count.html" => Some(File {
      content: include_str!("./web/count.html").into(), 
      mime: "text/html".into(),
      safe_to_embed: true
    }),
    _ => None,
  }
}
