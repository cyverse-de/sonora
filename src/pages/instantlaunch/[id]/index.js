/**
 * @author mian
 *
 * Instant launch launch page
 */
import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

import { useRouter } from "next/router";

import InstantLaunchStandalone from "components/instantlaunches/launch";

export default function InstantLaunch() {
    const router = useRouter();
    const { id, resource } = router.query;

    return <InstantLaunchStandalone id={id} resource={resource} />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("instantLaunch");

    return {
        props: {
            title,
            // "instantlaunches" already included by RequiredNamespaces
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
