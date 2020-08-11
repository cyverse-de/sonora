import React from "react";
import { Hidden } from "@material-ui/core";
import GlobalSearchField from "components/search/GlobalSearchField";
import DetailedSearchResults from "components/search/DetailedSearchResults";

export default function Search() {
    return (
        <>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <GlobalSearchField />
            </Hidden>
            <DetailedSearchResults baseId="search" />
        </>
    );
}

Search.getInitialProps = async () => ({
    namespacesRequired: ["common"],
});
