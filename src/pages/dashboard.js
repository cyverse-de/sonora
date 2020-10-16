import React from "react";

import Dashboard from "../components/Dashboard";

function DashboardPage() {
    return <Dashboard />;
}

DashboardPage.getInitialProps = async () => ({
    namespacesRequired: ["dashboard", "apps"],
});

export default DashboardPage;
