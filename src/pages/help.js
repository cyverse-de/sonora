/**
 *
 * @author sriram
 *
 * A page to access the DE Help center.
 *
 */

import React from "react";

import { serverSideTranslations, RequiredNamespaces } from "i18n";
import HelpTopics from "components/help/HelpTopics";

export default function Help() {
    return <HelpTopics baseId="help" />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "help",
                "intro",
                ...RequiredNamespaces,
            ])),
        },
    };
}
