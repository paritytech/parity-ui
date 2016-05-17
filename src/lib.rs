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
      name: "Status Page".to_owned(),
      version: "0.4.0".to_owned(),
      author: "Ethcore <admin@ethcore.io>".to_owned(),
      description: "Status Page for Parity".to_owned(),
      icon_url: "icon.png".to_owned(),
    }
  }
}

impl Default for App {
  fn default() -> Self {
    let files = {
      let mut files = HashMap::new();
      files.insert("181a2dbd5f80f18f6e174978baf7cde2.otf", File { path: "181a2dbd5f80f18f6e174978baf7cde2.otf", content_type: "font/opentype", content: include_bytes!("./web/181a2dbd5f80f18f6e174978baf7cde2.otf") });
      files.insert("269ca7e400c670e507c39eeafb9d36b9.otf", File { path: "269ca7e400c670e507c39eeafb9d36b9.otf", content_type: "font/opentype", content: include_bytes!("./web/269ca7e400c670e507c39eeafb9d36b9.otf") });
      files.insert("27e50ffd6a14cbc8221c9dbd3b5208dc.otf", File { path: "27e50ffd6a14cbc8221c9dbd3b5208dc.otf", content_type: "font/opentype", content: include_bytes!("./web/27e50ffd6a14cbc8221c9dbd3b5208dc.otf") });
      files.insert("3fbf5b8edc66b68a0e2ccfa598bbdae4.otf", File { path: "3fbf5b8edc66b68a0e2ccfa598bbdae4.otf", content_type: "font/opentype", content: include_bytes!("./web/3fbf5b8edc66b68a0e2ccfa598bbdae4.otf") });
      files.insert("596814caa4fbaecbf5014bcfe8e363fb.ttf", File { path: "596814caa4fbaecbf5014bcfe8e363fb.ttf", content_type: "application/x-font-ttf", content: include_bytes!("./web/596814caa4fbaecbf5014bcfe8e363fb.ttf") });
      files.insert("5db2ea1bcb7a6cc078755c90458c3b65.svg", File { path: "5db2ea1bcb7a6cc078755c90458c3b65.svg", content_type: "image/svg+xml", content: include_bytes!("./web/5db2ea1bcb7a6cc078755c90458c3b65.svg") });
      files.insert("69b59787ebf9a305c232d3f4c5730a20.png", File { path: "69b59787ebf9a305c232d3f4c5730a20.png", content_type: "image/png", content: include_bytes!("./web/69b59787ebf9a305c232d3f4c5730a20.png") });
      files.insert("ab2eba43f2caf800384bca4893e98fc8.otf", File { path: "ab2eba43f2caf800384bca4893e98fc8.otf", content_type: "font/opentype", content: include_bytes!("./web/ab2eba43f2caf800384bca4893e98fc8.otf") });
      files.insert("ce7225b836aa132de47ca39135bff16e.otf", File { path: "ce7225b836aa132de47ca39135bff16e.otf", content_type: "font/opentype", content: include_bytes!("./web/ce7225b836aa132de47ca39135bff16e.otf") });
      files.insert("d6cd4777dc581913c8b247b8bd44e02b.otf", File { path: "d6cd4777dc581913c8b247b8bd44e02b.otf", content_type: "font/opentype", content: include_bytes!("./web/d6cd4777dc581913c8b247b8bd44e02b.otf") });
      files.insert("f19a7f6c7a0b54b748277c40d7cf8882.eot", File { path: "f19a7f6c7a0b54b748277c40d7cf8882.eot", content_type: "application/vnd.ms-fontobject", content: include_bytes!("./web/f19a7f6c7a0b54b748277c40d7cf8882.eot") });
      files.insert("ff94ad94c3a9d04bd2f80cb3c87dcccb.woff", File { path: "ff94ad94c3a9d04bd2f80cb3c87dcccb.woff", content_type: "application/font-woff", content: include_bytes!("./web/ff94ad94c3a9d04bd2f80cb3c87dcccb.woff") });
      files.insert("icon.png", File { path: "icon.png", content_type: "image/png", content: include_bytes!("./web/icon.png") });
      files.insert("index.html", File { path: "index.html", content_type: "text/html", content: include_bytes!("./web/index.html") });
      files.insert("index.js", File { path: "index.js", content_type: "application/javascript", content: include_bytes!("./web/index.js") });
      files
    };
    App {
      files: files,
    }
  }
}
