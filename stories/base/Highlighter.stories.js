import React from "react";
import Highlighter from "components/highlighter/Highlighter";

export default {
    title: "base/Highlighter",
};

export function HighlighterTest({ searchText }) {
    return (
        <div>
            <Highlighter search={searchText}>zzz Ez as 123, ABC...</Highlighter>
        </div>
    );
}

HighlighterTest.argTypes = {
    searchText: {
        control: {
            type: "text",
        },
    },
};
