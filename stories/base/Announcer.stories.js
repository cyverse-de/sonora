import React from "react";
import Button from "@mui/material/Button";
import CyVerseAnnouncer, {
    announce,
} from "components/announcer/CyVerseAnnouncer";
import {
    BOTTOM,
    ERROR,
    LEFT,
    RIGHT,
    SUCCESS,
    TOP,
    WARNING,
} from "components/announcer/AnnouncerConstants";

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
export function AnnouncerTest() {
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "base/Announcer",
};
