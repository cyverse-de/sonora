/**
 *
 * @author sriram
 *
 * A page to access the DE Help center.
 *
 */

import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import HelpTopics from "components/help/HelpTopics";

export default function Help() {
    return <HelpTopics baseId="help" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("help");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "help",
                "intro",
                ...RequiredNamespaces,
            ])),
        },
    };
}
