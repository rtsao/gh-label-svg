const http = require('http');
const url = require('url');

const opentype = require('opentype.js');
const layer = require('color-composite');
const parse = require('color-parse');
const stringify = require('color-stringify');

const BOX_SHADOW = parse('rgba(27,31,35,0.12)');
const FONT_SIZE = 12;
const X_PADDING = 4;
const Y_PADDING = 3;

const font = opentype.loadSync('./SF-Pro-Text-Semibold.otf');

const lineHeight = FONT_SIZE + 2 * Y_PADDING;
const canvasHeight = lineHeight + 1;

const server = http.createServer((req, res) => {
  const {color, text} = url.parse(req.url, true).query;
  if (!isUndefined(color) && !isUndefined(text)) {
    const parsedColor = parse(color);
    if (!isUndefined(parsedColor.space)) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.end(
        svg(
          text,
          calcWidth(text),
          stringifyHex(parsedColor),
          calcShadow(parsedColor)
        )
      );
    }
  }
  res.statusCode = 400;
  res.end();
});

server.listen(8000);

function svg(text, width, fg, bg) {
  const paddedWidth = width + 2 * X_PADDING;
  return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${paddedWidth}" height="${canvasHeight}">
<rect x="0" y="1" width="${paddedWidth}" height="${lineHeight}" rx="3" fill="${bg}" />
<rect x="0" y="0" width="${paddedWidth}" height="${lineHeight}" rx="3" fill="${fg}" />
<text text-anchor="left" fill="#fff" x="${X_PADDING}" dy="0.39em" y="9" textLength="${width}" style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;text-rendering:geometricPrecision;">${text}</text>
</svg>
`;
}

function stringifyHex(color) {
  return stringify(color, 'hex');
}

function calcShadow(color) {
  return stringifyHex(layer([BOX_SHADOW, color]));
}

function calcWidth(text) {
  return font.getAdvanceWidth(text, FONT_SIZE, {
    kerning: true,
    features: false,
    hinting: false
  });
}

function isUndefined(x) {
  return x === void 0;
}
