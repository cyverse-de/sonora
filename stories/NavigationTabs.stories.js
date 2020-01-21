import React from "react";
import NavigationTabBar from "../src/components/navigationTabs";

const dashboard = () => <p>Dashboard goes here.</p>;
const apps = () => <p>Apps goes here.</p>;
const data = () => <p>Data goes here.</p>;
const analyses = () => <p>Analyses goes here.</p>;
const tools = () => <p>Tools goes here.</p>;
const community = () => <p>Community goes here.</p>;
const alerts = () => <p>Alerts goes here.</p>;

const NavigationTabsTest = () => {
    return (
        <NavigationTabBar
            dashboard={dashboard}
            apps={apps}
            data={data}
            analyses={analyses}
            tools={tools}
            community={community}
            alerts={alerts}
        />
    );
};

export default { title: "NavigationTabs" };

export const NavigationTabs = () => <NavigationTabsTest />;
