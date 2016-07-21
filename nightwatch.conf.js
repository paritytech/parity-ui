module.exports = {
  'src_folders': ['./test/e2e'],
  'output_folder': 'reports',
  'custom_commands_path': '',
  'custom_assertions_path': '',
  'page_objects_path': '',
  'globals_path': '',

  'selenium': {
    'start_process': true,
    'server_path': 'node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.53.0.jar',
    'log_path': '',
    'host': '127.0.0.1',
    'port': 4444,
    'cli_args': {
      'webdriver.chrome.driver': 'node_modules/chromedriver/bin/chromedriver',
      'webdriver.ie.driver': ''
    }
  },

  'test_settings': {
    'firefox': {
      'desiredCapabilities': {
        'browserName': 'firefox',
        'javascriptEnabled': true,
        'acceptSslCerts': true
      }
    },

    'chrome': {
      'globals': {
        'retryAssertionTimeout': 3000
      },
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true
      }
    },

    'ie': {
      'desiredCapabilities': {
        'browserName': 'internet explorer',
        'javascriptEnabled': true,
        'acceptSslCerts': true
      }
    },

    'safari': {
      'desiredCapabilities': {
        'browserName': 'safari',
        'javascriptEnabled': true,
        'acceptSslCerts': true
      }
    },
    'saucelabs-ie-9': saucelab('Windows 7', 'internet explorer', '9'),
    'saucelabs-ie-10': saucelab('Windows 8', 'internet explorer', '10'),
    'saucelabs-ie-11': saucelab('Windows 10', 'internet explorer', '11'),
    'saucelabs-edge': saucelab('Windows 10', 'MicrosoftEdge'),
    'saucelabs-chrome-win': saucelab('Windows 10', 'chrome'),
    'saucelabs-chrome-linux': saucelab('Linux', 'chrome'),
    'saucelabs-chrome-mac': saucelab('OS X 10.11', 'chrome'),
    'saucelabs-firefox-win': saucelab('Windows 10', 'firefox'),
    'saucelabs-firefox-linux': saucelab('Linux', 'firefox'),
    'saucelabs-firefox-mac': saucelab('OS X 10.11', 'firefox'),
    'saucelabs-safari-mac': saucelab('OS X 10.11', 'safari')
  }

};

function saucelab (platform, browserName, browserVersion) {
  const config = {
    'selenium_host': 'ondemand.saucelabs.com',
    'selenium_port': 80,
    'username': '${SAUCE_USERNAME}',
    'access_key': '${SAUCE_ACCESS_KEY}',
    'use_ssl': false,
    'silent': true,
    'output': true,
    'globals': {
      'waitForConditionTimeout': 10000
    },
    'screenshots': {
      'enabled': false,
      'path': ''
    },
    'desiredCapabilities': {
      'tunnel-identifier': '${TRAVIS_JOB_NUMBER}',
      'build': 'build-${TRAVIS_JOB_NUMBER}',
      'name': 'typing',
      'browserName': browserName,
      'platform': platform,
      'javascriptEnabled': true,
      'databaseEnabled': true,
      'locationContextEnabled': true,
      'applicationCacheEnabled': true,
      'browserConnectionEnabled': true,
      'webStorageEnabled': true,
      'acceptSslCerts': true,
      'rotatable': true,
      'nativeEvents': true
    },
    'selenium': {
      'start_process': true
    }
  };

  if (browserVersion) {
    config.desiredCapabilities.version = browserVersion;
  }

  return config;
}
