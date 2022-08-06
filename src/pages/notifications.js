/**
 * Notifications listing page
 *
 * @author psarando
 */
import React from "react";

import { serverSideTranslations, RequiredNamespaces } from "i18n";
import NotificationsListing from "components/notifications/listing";

export default function Notifications() {
    return <NotificationsListing baseDebugId="notifications" />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "notifications",
                ...RequiredNamespaces,
            ])),
        },
    };
}
