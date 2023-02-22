/**
 * @author aramsey
 *
 * Instant launch listing page
 */
import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";
import Listing from "components/instantlaunches/listing";

export default function InstantLaunches() {
    return <Listing baseId="instantLaunches" />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            // "instantlaunches" already included by RequiredNamespaces
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
