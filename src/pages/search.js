import React from "react";
import { useRouter } from "next/router";
import { Hidden } from "@material-ui/core";
import GlobalSearchField from "components/search/GlobalSearchField";
import DetailedSearchResults from "components/search/detailed/DetailedSearchResults";

export default function Search() {
    const router = useRouter();
    const { searchTerm, filter } = router?.query;
    return (
        <>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <GlobalSearchField search={searchTerm} filter={filter} />
            </Hidden>
            <DetailedSearchResults
                baseId="search"
                searchTerm={router.query?.searchTerm}
                filter={filter}
            />
        </>
    );
}

Search.getInitialProps = async () => ({
    namespacesRequired: ["common", "search", "analyses"],
});
