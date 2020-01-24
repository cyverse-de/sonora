import React from "react";
import Navigation from "../components/navigation/Navigation";

export default function Dashboard() {
    return (
        <React.Fragment>
            <Navigation navigate="dashboard" />
            <div>This is dashboard!</div>
        </React.Fragment>
    );
}
