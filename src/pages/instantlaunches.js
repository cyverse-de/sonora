/**
 * @author aramsey
 *
 * Instant launch listing page
 */
import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import Listing from "components/instantlaunches/listing";

export default function InstantLaunches() {
    return <Listing baseId="instantLaunches" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("instantLaunches");

    return {
        props: {
            title,
            // "instantlaunches" already included by RequiredNamespaces
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
