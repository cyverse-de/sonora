import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import ReferenceGenomes from "../../components/apps/admin/referenceGenomes/ReferenceGenomes";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

export default function RefGenome() {
    const profile = useUserProfile()[0];
    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        return <ReferenceGenomes baseId="adminReferenceGenomes" />;
    }
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("referenceGenomes:referenceGenomes");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "referenceGenomes",
                ...RequiredNamespaces,
            ])),
        },
    };
}
