import React from "react";

import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
    return <Dashboard />;
}

DashboardPage.getInitialProps = async () => ({
    namespacesRequired: ["dashboard"],
});
