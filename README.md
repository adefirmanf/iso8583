## Installation

```sh
npm install iso8583-js
```

## Features

- Wrapping message into ISO8583
- Parse the message

## Usage

For readable message, you should initialization the structure of ISO. Examples :

```js
let x = new ISO8583({
  header: 'ISO015000017'
});

// Init the structure
x.init([
  ['SECONDARY_BITMAP', { bitmap: 1, length: 16 }],
  ['TRANSMISSION_DATETIME', { bitmap: 7, length: 10 }],
  ['SYSTEM_TRACE', { bitmap: 11, length: 6 }],
  ['NETWORK_MANAGEMENT', { bitmap: 70, length: 3 }]
]);

// Set the value
x.set('SECONDARY_BITMAP', '400000000000000');
x.set('TRANSMISSION_DATETIME', '0325042644');
x.set('SYSTEM_TRACE', '720957');
x.set('NETWORK_MANAGEMENT', '301');

// Wrap the message
console.log(X.wrapMsg());
```

## To-Do (Currently not supported yet)

- Initialization should being optional
- Bitmap on init method should ordered asc

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://adefirmanf.github.io"><img src="https://avatars0.githubusercontent.com/u/23324722?v=4" width="100px;" alt="Ade Firman F"/><br /><sub><b>Ade Firman F</b></sub></a><br /><a href="https://github.com/adefirmanf/iso8583/commits?author=adefirmanf" title="Code">💻</a> <a href="https://github.com/adefirmanf/iso8583/commits?author=adefirmanf" title="Documentation">📖</a> <a href="https://github.com/adefirmanf/iso8583/commits?author=adefirmanf" title="Tests">⚠️</a> <a href="#example-adefirmanf" title="Examples">💡</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
