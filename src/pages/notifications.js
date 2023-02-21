/**
 * Notifications listing page
 *
 * @author psarando
 */
import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";
import NotificationsListing from "components/notifications/listing";

export default function Notifications() {
    return <NotificationsListing baseDebugId="notifications" />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            // "notifications" already included by RequiredNamespaces
            ...(await serverSideTranslations(locale, RequiredNamespaces)),
        },
    };
}
