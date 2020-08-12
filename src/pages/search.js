import React from "react";
import { useRouter } from "next/router";
import { Hidden } from "@material-ui/core";
import GlobalSearchField from "components/search/GlobalSearchField";
import DetailedSearchResults from "components/search/DetailedSearchResults";

export default function Search() {
    const router = useRouter();
    return (
        <>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <GlobalSearchField />
            </Hidden>
            <DetailedSearchResults
                baseId="search"
                searchTerm={router.query?.searchTerm}
            />
        </>
    );
}

Search.getInitialProps = async () => ({
    namespacesRequired: ["common"],
});
