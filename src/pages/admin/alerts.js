import React, { useState } from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

import AlertsEditor from "components/alerts/admin/AlertsAdmin";

export default function AlertsAdminPage() {
    const profile = useUserProfile()[0];
    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        return <AlertsEditor />;
    }
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("common:alerts");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
