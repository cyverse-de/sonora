import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";
import Dashboard from "components/dashboard";

function DashboardPage() {
    return <Dashboard />;
}

export async function getServerSideProps(context) {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "dashboard",
                "intro",
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default DashboardPage;
