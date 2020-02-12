import React, { Component } from "react";
import Navigation from "../src/components/navigation/Navigation";
import { storiesOf } from "@storybook/react";

class NavigationTest extends Component {
    render() {
        return <Navigation />;
    }
}

storiesOf("Navigation", module).add("with navigation", () => (
    <NavigationTest />
));
