import React from "react";
import { useRouter } from "next/router";
import { Hidden } from "@material-ui/core";
import GlobalSearchField from "components/search/GlobalSearchField";
import DetailedSearchResults from "components/search/detailed/DetailedSearchResults";
import { SEARCH_RESULTS_TABS } from "components/search/detailed/DetailedSearchResults";
import searchConstants from "components/search//constants";
import NavigationConstants from "common/NavigationConstants";

export default function Search() {
    const router = useRouter();
    const { searchTerm, filter, selectedTab } = router?.query;
    let tab = selectedTab || SEARCH_RESULTS_TABS.data;

    return (
        <>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <GlobalSearchField search={searchTerm} filter={filter} />
            </Hidden>
            <DetailedSearchResults
                baseId="search"
                searchTerm={router.query?.searchTerm}
                filter={filter}
                selectedTab={tab}
                onTabSelectionChange={(event, selection) => {
                    router.push(
                        `/${NavigationConstants.SEARCH}?searchTerm=${searchTerm}&filter=${filter}&selectedTab=${selection}`
                    );
                }}
            />
        </>
    );
}

Search.getInitialProps = async () => ({
    namespacesRequired: ["common", "search", "analyses"],
});
