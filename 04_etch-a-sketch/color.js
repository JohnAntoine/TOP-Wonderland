export class Color {
  constructor(color) {
    let parsed, converted;
    parsed = this.parseRGB(color);
    converted = this.rgbToHsv(parsed);
    this.r = parsed.red;
    this.g = parsed.green;
    this.b = parsed.blue;
    this.h = converted.h;
    this.s = converted.s;
    this.v = converted.v;
  }

  parseRGB(rgb) {
    let parsed = rgb.split('(')[1];
    parsed = (parsed.search(',') >= 0) ? parsed.split(',') : parsed.split(' ');
    if (parsed.length > 3) parsed.pop();
    else parsed[2] = parsed[2].split(')')[0];
    const values = {
      red: parseFloat(parsed[0]),
      green: parseFloat(parsed[1]),
      blue: parseFloat(parsed[2]),
    }
    return values;
  }

  changeHSV({h = this.h, s = this.s * 100, v = this.v * 100} = {}) {
    const newColor = this.hsvToRgb({h: h, s: s/100, v: v/100});
    this.r = newColor.r;
    this.g = newColor.g;
    this.b = newColor.b;
    this.h = h;
    this.s = s/100;
    this.v = v/100;
  }

  rgb() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  rgbToHsv(values) {
    let r, g, b, max, min, h, s, v;
    r = values.red / 255;
    g = values.green / 255;
    b = values.blue / 255;

    if ((r === g) && (r === b)) {
      max = r;
      min = r;
      h = 0;
    } else if ((r >= g) && (r >= b)) {
      max = r;
      min = (g <= b) ? g : b;
      h = 60 * ((g - b)/(max - min));
    } else if ((g >= r) && (g >= b)) {
      max = g;
      min = (r <= b) ? r : b;
      h = 60 * ( 2 + ((b - r)/(max - min)));
    } else {
      max = b;
      min = (r <= g) ? r : g;
      h = 60 * ( 4 + ((g - r)/(max - min)));
    }
    if (h < 0) {
      h = h + 360;
    }

    h = Math.round(h);
    s = (max) ? (max - min)/max : 0;
    v = max;

    return {h: h, s: s, v: v};
  }

  hsvToRgb(values) {
    let h,s,v,r,g,b,chroma,hueZone,xVal, match;
    h = values.h;
    s = values.s;
    v = values.v;
    chroma = v * s;
    hueZone = h / 60;
    xVal = chroma * ( 1 - Math.abs((hueZone % 2) - 1) );
    match = v - chroma;

    if ( hueZone >= 0 && hueZone < 1 ) {
      r = chroma;
      g = xVal;
      b = 0;
    } else if ( hueZone >= 1 && hueZone < 2 ) {
      r = xVal;
      g = chroma;
      b = 0;
    } else if ( hueZone >= 2 && hueZone < 3 ) {
      r = 0;
      g = chroma;
      b = xVal;
    } else if ( hueZone >= 3 && hueZone < 4 ) {
      r = 0;
      g = xVal;
      b = chroma;
    } else if ( hueZone >= 4 && hueZone < 5 ) {
      r = xVal;
      g = 0;
      b = chroma;
    } else if ( hueZone >= 5 && hueZone < 6 ) {
      r = chroma;
      g = 0;
      b = xVal;
    } else {
      r = 0;
      g = 0;
      b = 0;
    }

    r = Math.round((r + match) * 255);
    g = Math.round((g + match) * 255);
    b = Math.round((b + match) * 255);

    return {r: r, g: g, b: b};
  }

}
