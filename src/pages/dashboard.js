import React from "react";

import Dashboard from "../components/dashboard";

export default function DashboardPage() {
    return <Dashboard />;
}

DashboardPage.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["dashboard"] };
};
