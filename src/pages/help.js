/**
 *
 * @author sriram
 *
 * A page to access the DE Help center.
 *
 */

import React from "react";

import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";
import HelpTopics from "components/help/HelpTopics";

export default function Help() {
    return <HelpTopics baseId="help" />;
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("help");

    return {
        props: {
            title,
            ...(await commonServerSideProps(locale, ["help", "intro"])),
        },
    };
}
