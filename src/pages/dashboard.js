import React from "react";

import Dashboard from "../components/dashboard";

function DashboardPage() {
    return <Dashboard />;
}

DashboardPage.getInitialProps = async () => ({
    namespacesRequired: ["dashboard", "apps"],
});

export default DashboardPage;
