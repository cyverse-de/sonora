import React from "react";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
import Preferences from "../components/preferences/Preferences";

export default function Settings() {
    return <Preferences baseId="preferences" />;
}
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "preferences",
                "util",
                ...RequiredNamespaces,
            ])),
        },
    };
}
