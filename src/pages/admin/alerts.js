import React, { useState } from "react";

import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";
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
            ...(await commonServerSideProps(locale, ["alerts-admin"])),
        },
    };
}
