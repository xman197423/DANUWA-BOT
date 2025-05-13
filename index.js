(function () {
  const _0x4501d3 = require;
  const _0x321c = [
    'express',
    'writeFile',
    'SESSION_ID',
    'get',
    'url',
    'env',
    'function',
    'randomBytes',
    'split',
    'RECEIVED_COMMAND',
    's.whatsapp.net',
    'toLowerCase',
    'readdirSync',
    'plugins/',
    'fromURL',
    'randomBytesSync',
    'log',
    'sendMessage',
    'replace',
    'conversation',
    'trim',
    'includes',
    'pattern',
    'slice',
    'caption',
    'toString',
    'auth_info_baileys/creds.json',
    'message',
    'file',
    'endsWith',
    'auth_info_baileys/',
    'terminal',
    'macOS',
    'bio',
    'ephemeralMessage',
    'text',
    'startsWith',
    'alias',
    'Baileys',
    'PORT',
    'megajs',
    'AUTO_READ_STATUS',
    'ownerNumber',
    'config',
    'length',
    'catch',
    'console',
    'groupMetadata',
    'groupAdmins',
    'groupName',
    'key',
    'commands',
    'command',
    'sender',
    'status@broadcast',
    'useMultiFileAuthState',
    'pushName',
    'viewOnceMessage',
    'browser',
    'level',
    'download',
    'quoted',
    'silent',
    'File',
    'require',
    'throw',
    'text',
    'url',
    'toLowerCase',
    'env',
    'connection.update',
    'creds.update',
    'messages.upsert',
    'readMessages',
    'from',
    'senderNumber',
    'groupName',
    'messageType',
    'type',
    'getContentType',
    'startsWith',
    'console.error',
    'replyHandlers',
    'filter',
    'reply',
    'server running → http://localhost:',
    'Hey, DANUWA-MD started✅',
    'log',
    'setTimeout',
    'Initializing WhatsApp connection...',
    'Installing plugins...',
    'Plugins installed successfully.',
    'Successfully connected to WhatsApp!',
    'sendMessage',
    'image',
    'url',
    'caption',
    '📥 [DANUWA-MD] Session file downloaded and saved.',
    'text',
    'catch'
  ];
  (function (_0x23317e, _0x3614f1) {
    const _0x1ed688 = function (_0x3700ae) {
      while (--_0x3700ae) {
        _0x23317e['push'](_0x23317e['shift']());
      }
    };
    _0x1ed688(++_0x3614f1);
  })(_0x321c, 0x100);
  const _0x5f25 = function (_0x2cabe8) {
    _0x2cabe8 = _0x2cabe8 - 0x0;
    return _0x321c[_0x2cabe8];
  };

  const makeWASocket = _0x4501d3('@whiskeysockets/baileys')['default'];
  const {
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers,
    downloadMediaMessage,
    proto: WAProto
  } = _0x4501d3('@whiskeysockets/baileys');

  const fs = _0x4501d3('fs');
  const P = _0x4501d3('pino');
  const config = _0x4501d3('./config');
  const { ownerNumber } = _0x4501d3('./config');
  const util = _0x4501d3('util');
  const axios = _0x4501d3('axios');
  const qrcode = _0x4501d3('qrcode-terminal');
  const { sms } = _0x4501d3('./lib/msg');
  const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
  } = _0x4501d3('./lib/functions');
  const { File } = _0x4501d3('megajs');
  const express = _0x4501d3(_0x5f25('0x0'));

  const app = express();
  const port = process[_0x5f25('0x1')][_0x5f25('0x2')] || 0x1f40;

  const prefix = '.';
  if (!fs.existsSync(__dirname + '/' + _0x5f25('0x1f'))) {
    if (!config[_0x5f25('0x2')]) return console[_0x5f25('0x3')]('❗ [DANUWA-MD] SESSION_ID not found in env. Please configure it.');
    const sessdata = config[_0x5f25('0x2')];
    const filer = File[_0x5f25('0x4')]('https://mega.nz/file/' + sessdata);
    filer[_0x5f25('0x5')]((err, data) => {
      if (err) throw err;
      fs[_0x5f25('0x6')](__dirname + '/' + _0x5f25('0x1f'), data, () => {
        console[_0x5f25('0x3')](_0x5f25('0x7'));
      });
    });
  }

  const { replyHandlers, commands } = _0x4501d3('./command');

  async function connectToWA() {
    console[_0x5f25('0x3')](_0x5f25('0x8'));
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/' + _0x5f25('0x20'));
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
      logger: P({ level: _0x5f25('0x21') }),
      printQRInTerminal: false,
      browser: Browsers[_0x5f25('0x22')]('Firefox'),
      syncFullHistory: true,
      auth: state,
      version
    });

    conn.ev.on(_0x5f25('0x23'), (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      } else if (connection === 'open') {
        console[_0x5f25('0x3')](_0x5f25('0x9'));
        const path = _0x4501d3('path');
        fs[_0x5f25('0x24')]('./' + _0x5f25('0x25')).forEach((plugin) => {
          if (path.extname(plugin)[_0x5f25('0x26')]() === '.js') {
            _0x4501d3('./' + _0x5f25('0x25') + plugin);
          }
        });
        console[_0x5f25('0x3')](_0x5f25('0xa'));
        console[_0x5f25('0x3')](_0x5f25('0xb'));

        conn[_0x5f25('0xc')](
          ownerNumber[0] + '@s.whatsapp.net',
          {
            image: { url: config.ALIVE_IMG },
            caption: '✅ DANUWA-MD is now online!'
          }
        );
      }
    });

    conn.ev.on(_0x5f25('0x27'), saveCreds);

    // Message handling stripped for brevity in this snippet
  }

  app[_0x5f25('0x2')]('/', (req, res) => {
    res.send(_0x5f25('0x3a'));
  });

  app.listen(port, () => console[_0x5f25('0x3')](_0x5f25('0x3b') + port));

  setTimeout(() => {
    connectToWA();
  }, 4000);
})();
