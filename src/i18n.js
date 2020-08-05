const NextI18Next = require("next-i18next").default;
const path = require("path");

module.exports = new NextI18Next({
    defaultLanguage: "en",
    otherLanguages: [],
    localePath: path.resolve("./public/static/locales"),
});
