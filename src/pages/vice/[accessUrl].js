/**
 * @author aramsey
 *
 * A page for viewing the vice loading page
 */

import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
import ViceLoading from "components/vice/loading";

export default function Loading() {
    const router = useRouter();
    const { accessUrl } = router.query;

    return <ViceLoading accessUrl={accessUrl} />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "vice-loading",
                ...RequiredNamespaces,
            ])),
        },
    };
}
