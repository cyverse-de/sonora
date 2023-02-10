import React from "react";
import { useRouter } from "next/router";
import { Hidden } from "@material-ui/core";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
import GlobalSearchField from "components/search/GlobalSearchField";
import DetailedSearchResults from "components/search/detailed/DetailedSearchResults";
import SEARCH_RESULTS_TABS from "components/search/detailed/tabs";
import NavigationConstants from "common/NavigationConstants";

export default function Search() {
    const router = useRouter();
    const { searchTerm, filter, selectedTab, advancedDataQuery } =
        router?.query;
    let tab = selectedTab || SEARCH_RESULTS_TABS.data;
    const onShowDetailedSearch = (query) => {
        router.push({
            pathname: `/${NavigationConstants.SEARCH}`,
            query,
        });
    };

    return (
        <>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <GlobalSearchField
                    search={searchTerm}
                    selectedFilter={filter}
                    onShowDetailedSearch={onShowDetailedSearch}
                />
            </Hidden>
            <DetailedSearchResults
                baseId="search"
                searchTerm={searchTerm}
                advancedDataQuery={advancedDataQuery}
                filter={filter}
                selectedTab={tab}
                onTabSelectionChange={(event, selection) => {
                    router.push({
                        pathname: `/${NavigationConstants.SEARCH}`,
                        query: {
                            searchTerm,
                            advancedDataQuery,
                            filter,
                            selectedTab: selection,
                        },
                    });
                }}
            />
        </>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "data",
                "teams",
                // "search" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}
