import React from "react";

import { commonServerSideProps } from "common/getServerSideProps";
import Dashboard from "components/dashboard";

function DashboardPage() {
    return <Dashboard />;
}

export async function getServerSideProps(context) {
    const { locale } = context;

    return {
        props: {
            ...(await commonServerSideProps(locale, ["dashboard", "intro"])),
        },
    };
}

export default DashboardPage;
