/**
 * Notifications listing page
 *
 * @author psarando
 */
import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import NotificationsListing from "components/notifications/listing";

export default function Notifications() {
    return <NotificationsListing baseDebugId="notifications" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("notifications");

    return {
        props: {
            title,
            // "notifications" already included by RequiredNamespaces
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
