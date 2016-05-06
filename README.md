# Web UI PoC

## Running

```bash
$ npm i
$ npm start
$ open http://localhost:3010 || xdg-open http://localhost:3010
```

## Running with proxy

```bash
$ git clone https://github.com/tomusdrw/parity-proxy-poc.git
$ cd parity-proxy-poc
$ npm i
$ npm start
```

Configure your system/browser proxy. Specify `proxy.pac` file:

```
http://localhost:8888/proxy.pac
```

Instructions: [Ubuntu](http://askubuntu.com/questions/37306/how-do-i-configure-apt-to-use-a-proxy-pac-file), [Mac OS](https://support.apple.com/kb/PH18553)

PAC file redirects all `*.parity` and `*.ipfs` addresses to your local server.
