import React from "react";
import Navigation from "../components/navigation/Navigation";
import NavigationConstants from "../components/navigation/NavigationConstants";

export default function Dashboard() {
    return (
        <React.Fragment>
            <Navigation activeView={NavigationConstants.DASHBOARD} />
            <div>This is dashboard!</div>
        </React.Fragment>
    );
}
