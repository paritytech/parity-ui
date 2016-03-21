extern crate parity_webapp;

use std::default::Default;
use parity_webapp::WebApp;
use parity_webapp::File;

pub struct Wallet {
	index: File,
	css: File,
	js: File,
}

impl WebApp for Wallet {
  fn files(&self) -> Vec<&File> {
    vec![&self.index, &self.css, &self.js]
  }
}

impl Default for Wallet {
	fn default() -> Self {
		AdminApp {
			index: File { path: "index.html", content_type: "text/html", content: include_str!("./web/index.html") },
			css: File { path: "app.css", content_type: "text/css", content: include_str!("./web/app.css") },
			js: File { path: "app.js", content_type: "application/javascript", content: include_str!("./web/app.js") },
		}
	}
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
    }
}
