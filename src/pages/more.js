import React from "react";
import Navigation from "../components/navigation/Navigation";

export default function Dashboard() {
    return (
        <React.Fragment>
            <Navigation navigate="more"/>
            <div>More Options</div>
        </React.Fragment>
    );
}