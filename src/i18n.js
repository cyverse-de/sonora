import NextI18Next from "next-i18next";
import path from "path";
import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

/**
 * The singular instance of next-i18next to be used throughout the app.
 * Every page and component that needs i18n should use appWithTranslation,
 * useTranslation, and withTranslation exported from this instance
 *
 * See examples here from the next-i18next repo:
 * https://github.com/isaachinman/next-i18next/tree/master/examples/simple
 */
const {
    i18n,
    useTranslation,
    withTranslation,
    appWithTranslation,
} = new NextI18Next({
    defaultLanguage: "en",
    otherLanguages: [],
    localePath: path.resolve("./public/static/locales"),
});

/**
 * A wrapper component to provide i18n capabilities to Storybook as well as
 * jest tests
 *
 * Copied suggestion from https://github.com/isaachinman/next-i18next/issues/324
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
function I18nProviderWrapper({ children }) {
    return (
        <Suspense fallback={"Loading..."}>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </Suspense>
    );
}

// reexport everything
export {
    i18n,
    useTranslation,
    withTranslation,
    appWithTranslation,
    I18nProviderWrapper,
};
