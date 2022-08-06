/**
 * @author aramsey
 *
 * Instant launch listing page
 */
import React from "react";

import { serverSideTranslations, RequiredNamespaces } from "i18n";
import Listing from "components/instantlaunches/listing";

export default function InstantLaunches() {
    return <Listing baseId="instantLaunches" />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "instantlaunches",
                "dashboard",
                ...RequiredNamespaces,
            ])),
        },
    };
}
