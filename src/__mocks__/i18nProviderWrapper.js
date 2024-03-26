import React, { Suspense } from "react";

import I18NextClient from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

import nextI18NextConfig from "../../next-i18next.config";

I18NextClient.use(Backend)
    .use(initReactI18next)
    .init({
        ...nextI18NextConfig,
        backend: { loadPath: "/static/locales/{{lng}}/{{ns}}.json" },
        debug: false,
        // By default, next-i18next disables `escapeValue`.
        interpolation: { escapeValue: false },
    });

/**
 * A wrapper component to provide i18n capabilities to Storybook as well as
 * jest tests
 *
 * Referenced example from
 * https://github.com/i18next/react-i18next/blob/v12.1.4/example/storybook/src/i18n.js
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function I18nProviderWrapper({ children }) {
    return (
        <Suspense fallback={"Loading i18n..."}>
            <I18nextProvider i18n={I18NextClient}>{children}</I18nextProvider>
        </Suspense>
    );
}
