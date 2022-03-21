import ColorControl from "../ColorControl.js";
const hsv2hsl = (h,s,v,l=v-v*s/2, m=Math.min(l,1-l)) => [h,m?(v-l)/m:0,l];
function cmyk2Rgb2(c, m, y, k)
{
    c = (255 * c) / 100;
    m = (255 * m) / 100;
    y = (255 * y) / 100;
    k = (255 * k) / 100;

    let r = Math.round(((255 - c) * (255 - k)) / 255) ;
    let g = Math.round((255 - m) * (255 - k) / 255) ;
    let b = Math.round((255 - y) * (255 - k) / 255) ; 

    return [r, g, b];
}

// Hue
new ColorControl("hue-color-control", [document.getElementById("hue-input")], (changeColor, val) => {
    changeColor(`hsl(${val}, 100%, 50%)`);
});
// Saturation
new ColorControl("saturation-color-control", [document.getElementById("saturation-input")], (changeColor, val) => {
    changeColor(`hsl(40, ${val}%, 50%)`);
});
// Value
new ColorControl("value-color-control", [document.getElementById("value-input")], (changeColor, val) => {
    changeColor(`hsl(40, ${hsv2hsl(40, 1, val/100)[1]*100}%, ${hsv2hsl(40, 1, val/100)[2]*100}%)`);
});
// Lightness
new ColorControl("lightness-color-control", [document.getElementById("lightness-input")], (changeColor, val) => {
    changeColor(`hsl(40, 100%, ${val}%)`);
});

// RGB
new ColorControl("rgb-color-control",
    [
        document.getElementById("rgb-r-input"),
        document.getElementById("rgb-g-input"),
        document.getElementById("rgb-b-input")
    ],
    (changeColor, r, g, b) => {
        changeColor(`rgb(${r}, ${g}, ${b})`);
    }
);
// CMY
new ColorControl("cmy-color-control",
    [
        document.getElementById("cmy-c-input"),
        document.getElementById("cmy-m-input"),
        document.getElementById("cmy-y-input")
    ],
    (changeColor, c, m, y) => {
        const [r, g, b] = cmyk2Rgb2(c, m, y, 0);
        changeColor(`rgb(${r}, ${g}, ${b})`);
    }
);
// HSV
new ColorControl("hsv-color-control",
    [
        document.getElementById("hsv-h-input"),
        document.getElementById("hsv-s-input"),
        document.getElementById("hsv-v-input")
    ],
    (changeColor, h, s, v) => {
        const [hslH, hslS, hslL] = hsv2hsl(h, s/100, v/100);
        changeColor(`hsl(${hslH}, ${hslS*100}%, ${hslL*100}%)`);
    }
);
// HSL
new ColorControl("hsl-color-control",
    [
        document.getElementById("hsl-h-input"),
        document.getElementById("hsl-s-input"),
        document.getElementById("hsl-l-input")
    ],
    (changeColor, h, s, l) => {
        changeColor(`hsl(${h}, ${s}%, ${l}%)`);
    }
);