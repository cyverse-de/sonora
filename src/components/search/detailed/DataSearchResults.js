/**
 *
 * Display tablular view of detailed data search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { queryCache } from "react-query";
import Link from "next/link";
import { useTranslation } from "i18n";

import styles from "./styles";
import constants from "../../../constants";
import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import { useDataSearchInfinite } from "../searchQueries";
import searchConstants from "../constants";

import { DATA_SEARCH_QUERY_KEY } from "serviceFacades/filesystem";
import { BOOTSTRAP_KEY } from "serviceFacades/users";
import NavigationConstants from "common/NavigationConstants";
import ResourceIcon from "components/data/listing/ResourceIcon";
import { getParentPath } from "components/data/utils";
import ResourceTypes from "components/models/ResourceTypes";

import { Highlighter } from "@cyverse-de/ui-lib";

import { Typography, Link as MuiLink, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(styles);

const NameLink = React.forwardRef((props, ref) => {
    const { name, searchTerm, onClick, href } = props;
    const classes = useStyles();
    return (
        <MuiLink
            href={href}
            onClick={onClick}
            ref={ref}
            className={classes.dataLink}
        >
            <Highlighter search={searchTerm}>{name}</Highlighter>
        </MuiLink>
    );
});

function Name(props) {
    const { resource, searchTerm } = props;

    const type = resource._type;
    let path = resource._source.path;

    //SS route to parent folder for the file util we have file viewers ready in sonora.
    if (type === ResourceTypes.FILE) {
        path = getParentPath(path);
    }

    const href = `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}`;
    const as = `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}${path}`;
    return (
        <Link href={href} as={as} passHref>
            <NameLink name={resource._source?.label} searchTerm={searchTerm} />
        </Link>
    );
}

export default function DataSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [dataSearchKey, setDataSearchKey] = useState(DATA_SEARCH_QUERY_KEY);
    const [sortField, setSortField] = useState("label");
    const [sortOrder, setSortOrder] = useState("ascending");
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);

    const { t } = useTranslation(["search"]);

    const bootstrapCache = queryCache.getQueryData(BOOTSTRAP_KEY);
    let userHomeDir = bootstrapCache?.data_info.user_home_path;
    if (userHomeDir) {
        userHomeDir = userHomeDir + "/";
    }

    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        error,
    } = useDataSearchInfinite(
        dataSearchKey,
        dataSearchQueryEnabled,
        (lastGroup, allGroups) => {
            const totalPage = Math.ceil(
                lastGroup?.total / searchConstants.DETAILED_SEARCH_PAGE_SIZE
            );
            if (allGroups.length < totalPage) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            setDataSearchKey([
                DATA_SEARCH_QUERY_KEY,
                {
                    searchTerm,
                    userHomeDir,
                    rowsPerPage: searchConstants.DETAILED_SEARCH_PAGE_SIZE,
                    sortField: sortField,
                    sortDir: sortOrder,
                },
            ]);
            setDataSearchQueryEnabled(true);
        }
    }, [searchTerm, sortField, sortOrder, userHomeDir]);

    useEffect(() => {
        if (data && data.length > 0) {
            updateResultCount(data[0].total);
        }
    }, [data, updateResultCount]);

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "icon",
                Cell: ({ row }) => {
                    const original = row?.original;
                    return <ResourceIcon type={original._type} />;
                },
                disableSortBy: true,
            },
            {
                Header: "Name",
                accessor: "_source.label",
                Cell: ({ row }) => (
                    <Name resource={row?.original} searchTerm={searchTerm} />
                ),
            },
            {
                Header: "Path",
                accessor: "_source.path",
                disableSortBy: true,
            },
        ],
        [searchTerm]
    );

    if (error) {
        return <SearchError error={error} baseId={baseId} />;
    }
    if (
        status !== constants.LOADING &&
        (!data || data.length === 0 || data[0]?.hits.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatdata = [];
    if (data && data.length > 0) {
        data.forEach((page) => {
            flatdata = [...flatdata, ...page.hits];
        });
    }

    return (
        <SearchResultsTable
            columns={columns}
            data={flatdata}
            baseId={baseId}
            loading={status === constants.LOADING}
            fetchMore={fetchMore}
            isFetchingMore={isFetchingMore}
            canFetchMore={canFetchMore}
            initialSortBy={[
                {
                    id: "_source." + sortField,
                    desc: sortOrder === "descending",
                },
            ]}
            onSort={(colId, descending) => {
                setSortField(colId.split(".")[1]);
                descending
                    ? setSortOrder("descending")
                    : setSortOrder("ascending");
            }}
        />
    );
}
