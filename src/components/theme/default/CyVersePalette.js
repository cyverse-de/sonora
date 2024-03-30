const oldPalette = {
    orange: "#f19e1f", // 241, 158, 31
    lightGreen: "#97af3c", // 151, 175, 60
    darkGreen: "#5c8727", // 92, 135, 39
    lightGray: "#e2e2e2", // 226, 226, 226
    gray: "#a5a4a4", // 165, 164, 164
    darkGray: "#525a68", // 82, 90, 104
    lightBlue: "#99d9ea", // 153, 217, 234
    blue: "#0971ab", // 9, 113, 171
    darkBlue: "#004471", // 0, 68, 113
    darkestBlue: "#142248", // 20, 34, 72
    white: "#ffffff",
    red: "#e60424",
};

const newPalette = {
    white: "#ffffff",
    lightSilver: "#e2e2e2",
    silver: "#a5a4a4",
    blueGrey: "#48515f",
    bgGray: "#f4f4f4",
    black: "#000000",
    darkNavy: "#142248",
    navy: "#004471",
    cobalt: "#0971AB", // primary
    sky: "#99D9EA",
    yellow: "#F7D21E",
    gold: "#F8981D",
    violet: "#AA2173",
    indigo: "#4A2E8D",
    leaf: "#378F43",
    grass: "#7CB342",
    alertRed: "#AF0404",
};

// Merge the two palettes for now. We'll eventually remove the old palette.
const CyVersePalette = {
    ...oldPalette,
    ...newPalette,
};

export default CyVersePalette;
