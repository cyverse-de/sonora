import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";
import Preferences from "../components/preferences/Preferences";

export default function Settings() {
    return <Preferences baseId="preferences" />;
}
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "preferences",
                ...RequiredNamespaces,
            ])),
        },
    };
}
