import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import CyverseAppBar from "../src/components/appBar/CyVerseAppBar";

export class AppBarTest extends Component {
    render() {
        return <CyverseAppBar/>;
    }

}

storiesOf("AppBar", module).add("with appbar", () => <AppBarTest />);