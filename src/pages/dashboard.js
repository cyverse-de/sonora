import React from "react";

import { serverSideTranslations, RequiredNamespaces } from "i18n";
import Dashboard from "components/dashboard";

function DashboardPage() {
    return <Dashboard />;
}

export async function getStaticProps(context) {
    // The `locale` prop is undefined in this page for some reason.
    const { locale, defaultLocale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? defaultLocale, [
                "dashboard",
                "intro",
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default DashboardPage;
