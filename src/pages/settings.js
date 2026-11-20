import React from "react";

import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";
import Preferences from "../components/preferences/Preferences";

export default function Settings() {
    return <Preferences baseId="preferences" />;
}
export async function getServerSideProps({ locale }) {
    const title = i18n.t("settings");

    return {
        props: {
            title,
            ...(await commonServerSideProps(locale, ["preferences"])),
        },
    };
}
