const http = require('http');
const {parse} = require('url');

const opentype = require('opentype.js');
const layer = require('color-composite');
const isDark = require('color-measure/is-dark');

// rgba(27,31,35,0.12)
const BOX_SHADOW = {
  space: 'rgb',
  values: [27, 31, 35],
  alpha: 0.12
};
const FONT_SIZE = 12;
const X_PADDING = 4;
const Y_PADDING = 3;

const font = opentype.loadSync('./SF-Pro-Text-Semibold.otf');

const lineHeight = FONT_SIZE + 2 * Y_PADDING;
const canvasHeight = lineHeight + 1;

const server = http.createServer((req, res) => {
  const {color, text} = parse(req.url, true).query;
  if (isNotUndefined(color) && isNotUndefined(text)) {
    const rgb = hexToRGB(color);
    if (isNotUndefined(rgb)) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.end(
        svg(
          text,
          calcWidth(text),
          stringifyHex(rgb),
          calcShadow(rgb),
          isDarkColor(rgb)
        )
      );
    }
  }
  res.statusCode = 400;
  res.end();
});

server.listen(8000);

function svg(text, width, fg, bg, dark) {
  const paddedWidth = width + 2 * X_PADDING;
  return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${paddedWidth}" height="${canvasHeight}">
<rect x="0" y="1" width="${paddedWidth}" height="${lineHeight}" rx="3" fill="${bg}" />
<rect x="0" y="0" width="${paddedWidth}" height="${lineHeight}" rx="3" fill="${fg}" />
<text text-anchor="left" fill="${dark
    ? '#fff'
    : '#000'}" x="${X_PADDING}" dy="0.39em" y="9" textLength="${width}" style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;text-rendering:geometricPrecision;">${text}</text>
</svg>
`;
}

function hexToRGB(hex) {
  if (hex.length !== 6) {
    return void 0;
  }
  const num = parseInt(hex, 16);
  if (Number.isNaN(num)) {
    return void 0;
  }
  return {
    space: 'rgb',
    values: [num >> 16, (num >> 8) & 255, num & 255],
    alpha: 1
  };
}

function isDarkColor(rgb) {
  const [r, g, b] = rgb.values;
  return isDark({
    red: () => r,
    green: () => g,
    blue: () => b
  });
}

function stringifyHex(color) {
  const [r, g, b] = color.values;
  return `#${((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1)}`;
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

function isNotUndefined(x) {
  return x !== void 0;
}
