import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CyVerseAnnouncer, {
    announce,
} from "../src/components/announcer/CyVerseAnnouncer";
import {
    BOTTOM,
    ERROR,
    LEFT,
    RIGHT,
    SUCCESS,
    TOP,
    WARNING,
} from "../src/components/announcer/AnnouncerConstants";

const action = () => {
    return (
        <Button
            color="secondary"
            size="small"
            onClick={() => console.log("Test Action clicked!")}
        >
            Test Action
        </Button>
    );
};
export class AnnouncerTest extends Component {
    render() {
        [
            {
                text: "this is an Information",
                duration: 3000,
                vertical: TOP,
                CustomAction: action,
            },
            {
                text: "this is Error Message",
                variant: ERROR,
                horizontal: RIGHT,
            },
            {
                text: "this is a Warning",
                variant: WARNING,
                duration: 10000,
                horizontal: LEFT,
                vertical: BOTTOM,
            },
            {
                text: "this is a Success",
                variant: SUCCESS,
            },
        ].forEach((msg) => announce(msg));

        return <CyVerseAnnouncer />;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "Announcer",
};
