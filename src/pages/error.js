/**
 * @author sriram
 *
 * A page that display error to the user.
 *
 *
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import ErrorHandler from "components/error/ErrorHandler";

export default function Error() {
    const router = useRouter();
    const errorInfo = router.query?.errorInfo;
    const errorObj = errorInfo ? JSON.parse(errorInfo) : null;
    return <ErrorHandler errorObject={errorObj} baseId="error" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("util:error");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
