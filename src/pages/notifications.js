/**
 * Notifications listing page
 *
 * @author psarando
 */
import React from "react";

import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";
import NotificationsListing from "components/notifications/listing";

export default function Notifications() {
    return <NotificationsListing baseDebugId="notifications" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("notifications");

    return {
        props: {
            title,
            // "notifications" already included by commonServerSideProps
            ...(await commonServerSideProps(locale)),
        },
    };
}
