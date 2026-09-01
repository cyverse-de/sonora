/**
 *
 * A page to access the admin resource presets interface.
 *
 */

import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";
import Listing from "components/resourcePresets/Listing";

export default function ResourcePresets() {
    const profile = useUserProfile()[0];
    const isAdmin = profile?.admin;

    if (!isAdmin) {
        return <NotAuthorized />;
    }

    return <Listing baseId="adminResourcePresets" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("resourcePresets:pageTitle");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "resourcePresets",
                ...RequiredNamespaces,
            ])),
        },
    };
}
