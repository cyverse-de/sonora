import React from "react";
import Navigation from "../components/navigation/Navigation";

export default function Dashboard() {
    return (
        <React.Fragment>
            <Navigation navigate="analyses"/>
            <div>View your analyses here</div>
        </React.Fragment>
    );
}
