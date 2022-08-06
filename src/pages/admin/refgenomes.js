import React from "react";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
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

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "referenceGenomes",
                ...RequiredNamespaces,
            ])),
        },
    };
}
