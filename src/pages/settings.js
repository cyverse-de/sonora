import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import Preferences from "../components/preferences/Preferences";

export default function Settings() {
    return <Preferences baseId="preferences" />;
}
export async function getServerSideProps({ locale }) {
    const title = i18n.t("settings");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "preferences",
                ...RequiredNamespaces,
            ])),
        },
    };
}
