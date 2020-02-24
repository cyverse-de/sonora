import React, { Component } from "react";
import GlobalSearchField from "../src/components/search/GlobalSearchField";
class GlobalSearchFieldTest extends Component {
    render() {
        return <GlobalSearchField />;
    }
}

export default { title: "Global Search Field" };

export const SearchField = () => <GlobalSearchFieldTest />;
