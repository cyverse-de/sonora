/**
 * @author aramsey
 *
 * Instant launch listing page
 */
import React from "react";

import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";
import Listing from "components/instantlaunches/listing";

export default function InstantLaunches() {
    return <Listing baseId="instantLaunches" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("instantLaunches");

    return {
        props: {
            title,
            // "instantlaunches" already included by commonServerSideProps
            ...(await commonServerSideProps(locale)),
        },
    };
}
