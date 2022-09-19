//预设三套主题
const themeBlue = {
    "theme-deep-color1": "rgb(59, 74, 94)",
    "theme-deep-color2": "rgb(45, 58, 75)",
    "theme-deep-color3": "rgb(42, 50, 65)",
    "theme-deep-color4": "rgb(32, 40, 51)",
    "theme-main-color1": "rgb(64, 158, 255)",
    "theme-main-color2": "rgb(90, 163, 236)",
    "theme-main-color3": "rgb(30, 50, 87)",
    "theme-sider-font": "rgb(250, 250, 250)",
};
const themeGreen = {
    "theme-deep-color1": "rgb(253, 255, 253)",
    "theme-deep-color2": "rgb(233, 243, 234)",
    "theme-deep-color3": "rgb(229, 240, 231)",
    "theme-deep-color4": "rgb(198, 219, 203)",
    "theme-main-color1": "rgb(118, 189, 99)",
    "theme-main-color2": "rgb(131, 209, 109)",
    "theme-main-color3": "rgb(109, 168, 122)",
    "theme-sider-font": "rgb(91, 124, 111)",
};
const goldAndgrey = {
    "theme-deep-color1": "rgb(95, 100, 107)",
    "theme-deep-color2": "rgb(65, 74, 85)",
    "theme-deep-color3": "rgb(56, 63, 75)",
    "theme-deep-color4": "rgb(39, 42, 48)",
    "theme-main-color1": "rgb(253, 208, 42)",
    "theme-main-color2": "rgb(212, 175, 40)",
    "theme-main-color3": "rgb(46, 51, 59)",
    "theme-sider-font": "rgb(250, 250, 250)",
};

const themes = {
    themeBlue,
    goldAndgrey,
    themeGreen,
};

//改变当前主题
export function changetheme(name) {
    let theme = themes[name];
    for (let key in theme) {
        document.body.style.setProperty(`--${key}`, theme[key]);
    }
}
