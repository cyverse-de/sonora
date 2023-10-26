import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Hidden } from "@material-ui/core";
import { i18n, RequiredNamespaces } from "i18n";
import GlobalSearchField from "components/search/GlobalSearchField";
import DetailedSearchResults from "components/search/detailed/DetailedSearchResults";
import SEARCH_RESULTS_TABS from "components/search/detailed/tabs";
import NavigationConstants from "common/NavigationConstants";
import { useConfig } from "contexts/config";

export default function Search() {
    const [config] = useConfig();
    const router = useRouter();
    const defaultTab = config?.elasticEnabled
        ? SEARCH_RESULTS_TABS.data
        : SEARCH_RESULTS_TABS.apps;
    const { searchTerm, filter, selectedTab, advancedDataQuery } =
        router?.query;

    let tab = selectedTab || defaultTab;
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

export async function getServerSideProps(context) {
    const {
        locale,
        query: { searchTerm },
    } = context;

    let title = i18n.t("search");
    if (searchTerm) {
        title = i18n.t("search:pageTitle", { searchTerm });
    }

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "data",
                "teams",
                // "search" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}
