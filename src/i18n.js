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

// The always-needed namespaces, mainly from the components in the global
// toolbars, such as bags, global search, and the notifications menu.
const RequiredNamespaces = [
    "analyses",
    "apps",
    "bags",
    "common",
    "instantlaunches",
    "notifications",
    "search",
    "sharing",
    "subscriptions",
    "util",
];

// reexport everything
export {
    i18n,
    useTranslation,
    withTranslation,
    appWithTranslation,
    Trans,
    RequiredNamespaces,
};
