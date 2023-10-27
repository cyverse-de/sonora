/**
 * @author aramsey
 *
 * A page for viewing the vice loading page
 */

import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import ViceLoading from "components/vice/loading";

export default function Loading() {
    const router = useRouter();
    const { accessUrl } = router.query;

    return <ViceLoading accessUrl={accessUrl} />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("vice-loading:initializingVice");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "vice-loading",
                ...RequiredNamespaces,
            ])),
        },
    };
}
