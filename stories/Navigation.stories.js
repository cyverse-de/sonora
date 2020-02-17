import React, { Component } from "react";
import Navigation from "../src/components/layout/Navigation";

class NavigationTest extends Component {
    render() {
        return <Navigation />;
    }
}

export default { title: "Navigation" };
export const AppNavigation = () => <NavigationTest />;
