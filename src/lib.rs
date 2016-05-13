/// This file is generated. Do not edit it by hand.
/// This file is generated. Do not edit it by hand.
extern crate parity_webapp;

use std::default::Default;
use std::collections::HashMap;
use parity_webapp::WebApp;
use parity_webapp::File;

pub struct App {
  files: HashMap<&'static str, File>,
}

impl WebApp for App {
  fn file(&self, path: &str) -> Option<&File> {
    self.files.get(path)
  }
}


impl Default for App {
  fn default() -> Self {
    let files = {
      let mut files = HashMap::new();
      files.insert("inject.js", File { path: "inject.js", content_type: "application/javascript", content: include_str!("./web/inject.js").as_bytes() });
      files
    };
    App {
      files: files,
    }
  }
}
