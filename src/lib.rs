/// This file is generated. Do not edit it by hand.
/// This file is generated. Do not edit it by hand.
extern crate parity_webapp;

use std::default::Default;
use std::collections::HashMap;
use parity_webapp::{WebApp, File, Info};

pub struct App {
  files: HashMap<&'static str, File>,
}

impl WebApp for App {
  fn file(&self, path: &str) -> Option<&File> {
    self.files.get(path)
  }
  fn info(&self) -> Info {
    Info {
      name: "Identity Manager".to_owned(),
      version: "0.3.2".to_owned(),
      author: "Ethcore <admin@ethcore.io>".to_owned(),
      description: "Injectable identity manager for Parity".to_owned(),
      icon_url: "icon.png".to_owned(),
    }
  }
}

impl Default for App {
  fn default() -> Self {
    let files = {
      let mut files = HashMap::new();
      files.insert("cols.frame.html", File { path: "cols.frame.html", content_type: "text/html", content: include_bytes!("./web/cols.frame.html") });
      files.insert("cols.frame.js", File { path: "cols.frame.js", content_type: "application/javascript", content: include_bytes!("./web/cols.frame.js") });
      files.insert("home.js", File { path: "home.js", content_type: "application/javascript", content: include_bytes!("./web/home.js") });
      files.insert("index.html", File { path: "index.html", content_type: "text/html", content: include_bytes!("./web/index.html") });
      files.insert("inject.js", File { path: "inject.js", content_type: "application/javascript", content: include_bytes!("./web/inject.js") });
      files
    };
    App {
      files: files,
    }
  }
}
