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
      name: "Ethereum Wallet".to_owned(),
      version: "0.4.1".to_owned(),
      author: "Alexander Van de Sande <alex.vandesande@ethdev.com>, Fabian Vogelsteller <fabian.vogelsteller@gmail.com>".to_owned(),
      description: "Ethereum Wallet Ðapp for Parity".to_owned(),
      icon_url: "icon.png".to_owned(),
    }
  }
}

impl Default for App {
  fn default() -> Self {
    let files = {
      let mut files = HashMap::new();
      files.insert("42cc17ada80f1d6f4c7b5e0db1aafb13e0f98886.css", File { path: "42cc17ada80f1d6f4c7b5e0db1aafb13e0f98886.css", content_type: "text/css", content: include_bytes!("./web/42cc17ada80f1d6f4c7b5e0db1aafb13e0f98886.css") });
      files.insert("432e48a5f163013108733276d856e056fb1c089c.js", File { path: "432e48a5f163013108733276d856e056fb1c089c.js", content_type: "application/javascript", content: include_bytes!("./web/432e48a5f163013108733276d856e056fb1c089c.js") });
      files.insert("bitcoin-icon.svg", File { path: "bitcoin-icon.svg", content_type: "image/svg+xml", content: include_bytes!("./web/bitcoin-icon.svg") });
      files.insert("fontawesome/animated.less", File { path: "fontawesome/animated.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/animated.less") });
      files.insert("fontawesome/bordered-pulled.less", File { path: "fontawesome/bordered-pulled.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/bordered-pulled.less") });
      files.insert("fontawesome/core.less", File { path: "fontawesome/core.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/core.less") });
      files.insert("fontawesome/fixed-width.less", File { path: "fontawesome/fixed-width.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/fixed-width.less") });
      files.insert("fontawesome/font-awesome.less", File { path: "fontawesome/font-awesome.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/font-awesome.less") });
      files.insert("fontawesome/icons.less", File { path: "fontawesome/icons.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/icons.less") });
      files.insert("fontawesome/larger.less", File { path: "fontawesome/larger.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/larger.less") });
      files.insert("fontawesome/list.less", File { path: "fontawesome/list.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/list.less") });
      files.insert("fontawesome/mixins.less", File { path: "fontawesome/mixins.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/mixins.less") });
      files.insert("fontawesome/path.less", File { path: "fontawesome/path.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/path.less") });
      files.insert("fontawesome/rotated-flipped.less", File { path: "fontawesome/rotated-flipped.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/rotated-flipped.less") });
      files.insert("fontawesome/stacked.less", File { path: "fontawesome/stacked.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/stacked.less") });
      files.insert("fontawesome/variables.less", File { path: "fontawesome/variables.less", content_type: "text/less", content: include_bytes!("./web/fontawesome/variables.less") });
      files.insert("i18n/de.json", File { path: "i18n/de.json", content_type: "application/json", content: include_bytes!("./web/i18n/de.json") });
      files.insert("i18n/es.json", File { path: "i18n/es.json", content_type: "application/json", content: include_bytes!("./web/i18n/es.json") });
      files.insert("i18n/fr.json", File { path: "i18n/fr.json", content_type: "application/json", content: include_bytes!("./web/i18n/fr.json") });
      files.insert("i18n/ja.json", File { path: "i18n/ja.json", content_type: "application/json", content: include_bytes!("./web/i18n/ja.json") });
      files.insert("i18n/pt.json", File { path: "i18n/pt.json", content_type: "application/json", content: include_bytes!("./web/i18n/pt.json") });
      files.insert("i18n/ro.json", File { path: "i18n/ro.json", content_type: "application/json", content: include_bytes!("./web/i18n/ro.json") });
      files.insert("i18n/ru.json", File { path: "i18n/ru.json", content_type: "application/json", content: include_bytes!("./web/i18n/ru.json") });
      files.insert("i18n/tap-i18n.json", File { path: "i18n/tap-i18n.json", content_type: "application/json", content: include_bytes!("./web/i18n/tap-i18n.json") });
      files.insert("i18n/ua.json", File { path: "i18n/ua.json", content_type: "application/json", content: include_bytes!("./web/i18n/ua.json") });
      files.insert("i18n/zh-TW.json", File { path: "i18n/zh-TW.json", content_type: "application/json", content: include_bytes!("./web/i18n/zh-TW.json") });
      files.insert("icon.png", File { path: "icon.png", content_type: "image/png", content: include_bytes!("./web/icon.png") });
      files.insert("index.html", File { path: "index.html", content_type: "text/html", content: include_bytes!("./web/index.html") });
      files.insert("loading.css", File { path: "loading.css", content_type: "text/css", content: include_bytes!("./web/loading.css") });
      files.insert("packages/ethereum_dapp-styles/fonts/Montserrat-Black.otf", File { path: "packages/ethereum_dapp-styles/fonts/Montserrat-Black.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/Montserrat-Black.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/Montserrat-Bold.otf", File { path: "packages/ethereum_dapp-styles/fonts/Montserrat-Bold.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/Montserrat-Bold.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/Montserrat-Hairline.otf", File { path: "packages/ethereum_dapp-styles/fonts/Montserrat-Hairline.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/Montserrat-Hairline.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/Montserrat-Light.otf", File { path: "packages/ethereum_dapp-styles/fonts/Montserrat-Light.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/Montserrat-Light.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/Montserrat-Regular.otf", File { path: "packages/ethereum_dapp-styles/fonts/Montserrat-Regular.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/Montserrat-Regular.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/SourceSansPro-Black.otf", File { path: "packages/ethereum_dapp-styles/fonts/SourceSansPro-Black.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/SourceSansPro-Black.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/SourceSansPro-Bold.otf", File { path: "packages/ethereum_dapp-styles/fonts/SourceSansPro-Bold.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/SourceSansPro-Bold.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/SourceSansPro-ExtraLight.otf", File { path: "packages/ethereum_dapp-styles/fonts/SourceSansPro-ExtraLight.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/SourceSansPro-ExtraLight.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/SourceSansPro-Light.otf", File { path: "packages/ethereum_dapp-styles/fonts/SourceSansPro-Light.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/SourceSansPro-Light.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/SourceSansPro-Regular.otf", File { path: "packages/ethereum_dapp-styles/fonts/SourceSansPro-Regular.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/SourceSansPro-Regular.otf") });
      files.insert("packages/ethereum_dapp-styles/fonts/SourceSansPro-Semibold.otf", File { path: "packages/ethereum_dapp-styles/fonts/SourceSansPro-Semibold.otf", content_type: "font/opentype", content: include_bytes!("./web/packages/ethereum_dapp-styles/fonts/SourceSansPro-Semibold.otf") });
      files.insert("packages/ethereum_dapp-styles/icons/Simple-Line-Icons.eot", File { path: "packages/ethereum_dapp-styles/icons/Simple-Line-Icons.eot", content_type: "application/vnd.ms-fontobject", content: include_bytes!("./web/packages/ethereum_dapp-styles/icons/Simple-Line-Icons.eot") });
      files.insert("packages/ethereum_dapp-styles/icons/Simple-Line-Icons.svg", File { path: "packages/ethereum_dapp-styles/icons/Simple-Line-Icons.svg", content_type: "image/svg+xml", content: include_bytes!("./web/packages/ethereum_dapp-styles/icons/Simple-Line-Icons.svg") });
      files.insert("packages/ethereum_dapp-styles/icons/Simple-Line-Icons.ttf", File { path: "packages/ethereum_dapp-styles/icons/Simple-Line-Icons.ttf", content_type: "application/x-font-ttf", content: include_bytes!("./web/packages/ethereum_dapp-styles/icons/Simple-Line-Icons.ttf") });
      files.insert("packages/ethereum_dapp-styles/icons/Simple-Line-Icons.woff", File { path: "packages/ethereum_dapp-styles/icons/Simple-Line-Icons.woff", content_type: "application/font-woff", content: include_bytes!("./web/packages/ethereum_dapp-styles/icons/Simple-Line-Icons.woff") });
      files.insert("packages/ethereum_elements/identicon-load.gif", File { path: "packages/ethereum_elements/identicon-load.gif", content_type: "image/gif", content: include_bytes!("./web/packages/ethereum_elements/identicon-load.gif") });
      files.insert("wallet-icon.png", File { path: "wallet-icon.png", content_type: "image/png", content: include_bytes!("./web/wallet-icon.png") });
      files.insert("web3.js", File { path: "web3.js", content_type: "application/javascript", content: include_bytes!("./web/web3.js") });
      files
    };
    App {
      files: files,
    }
  }
}
