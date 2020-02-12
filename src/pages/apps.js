import React from "react";
import Navigation from "../components/navigation/Navigation";
import NavigationConstants from "../components/navigation/NavigationConstants";

export default function Apps() {
    return (
        <React.Fragment>
            <Navigation activeView={NavigationConstants.APPS} />
            <div>Launch an app from here</div>
        </React.Fragment>
    );
}
