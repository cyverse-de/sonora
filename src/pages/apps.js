import React from "react";
import Navigation from "../components/navigation/Navigation";

export default function Apps() {
    return (
        <React.Fragment>
            <Navigation navigate="apps" />
            <div>Launch an app from here</div>
        </React.Fragment>
    );
}
