import React, { Component } from "react";
import SearchField from "../src/components/searchField/SearchField";

export class SearchFieldTest extends Component {
    render() {
        const handleSearch =
            this.props.logger ||
            ((selection) => {
                console.log(selection);
            });

        return (
            <div>
                <label>Type at least 3 characters, then wait a second</label>
                <SearchField handleSearch={handleSearch} />
            </div>
        );
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "SearchField",
};