import React, { Suspense } from "react";

import I18NextClient from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
/**
 * The singular instances of i18n components to be used throughout the app.
 * Every page and component that needs i18n should use the components
 * exported from next-i18next.
 *
 * See examples here from the next-i18next repo:
 * https://github.com/i18next/next-i18next/tree/master/examples/simple
 */
import {
    i18n,
    useTranslation,
    withTranslation,
    appWithTranslation,
    Trans,
} from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// The two always-needed namespaces
const RequiredNamespaces = ["common", "bags"];

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
    I18NextClient.use(initReactI18next).init(nextI18NextConfig);

    return (
        <Suspense fallback={"Loading i18n..."}>
            <I18nextProvider i18n={I18NextClient}>{children}</I18nextProvider>
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
    Trans,
    serverSideTranslations,
    RequiredNamespaces,
};
