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

#[cfg(not(feature = "dev"))]
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

#[cfg(feature = "dev")]
pub fn handle(resource: &str) -> Option<File> {
  use std::path;
  use std::fs;
  use std::io::Read;

  fn guess_mime(path: &path::Path) -> String {
    path.extension()
      .and_then(|s| s.to_str())
      .map_or("application/octetstream", |extension| match extension {
        "html" => "text/html",
        "ico" => "image/ico",
        "js" => "application/javascript",
        "css" => "text/css",
        _ => "application/octetstream",
      })
      .into()
  }

  // TODO [ToDr] Warning! Directory structure assumptions below!
  let mut path = path::PathBuf::new();
  path.push("..");
  path.push("parity-dapps-minimal-sysui-rs");
  path.push("src");
  path.push("web");
  path.push(resource[1..].to_owned());

  let mime = guess_mime(&path);

  fs::File::open(path)
    .ok()
    .and_then(|mut f| {
      let mut s = String::new();
      f.read_to_string(&mut s).ok().map(move |_| {
        File {
          content: s,
          mime: mime,
          safe_to_embed: true
        }
      })
    })
}


