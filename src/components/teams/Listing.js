/**
 * @author aramsey
 *
 * A component that displays either the list of all teams a user has permissions
 * to view, only teams they are a member of, or the search results when
 * searching for a team via the global search
 */

import React, { useMemo, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import EmptyTable from "components/table/EmptyTable";

import { IconButton, Table, TableBody } from "@material-ui/core";
import { Info } from "@material-ui/icons";

import ids from "./ids";
import { useTranslation } from "i18n";
import TableLoading from "../table/TableLoading";
import { useQuery } from "react-query";
import {
    ALL_TEAMS_QUERY,
    getAllTeams,
    getMyTeams,
    MY_TEAMS_QUERY,
    SEARCH_TEAMS_QUERY,
} from "serviceFacades/groups";
import { TEAM_FILTER } from "./index";
import { useUserProfile } from "contexts/userProfile";
import isQueryLoading from "../utils/isQueryLoading";
import BasicTable from "../table/BasicTable";
import DELink from "../utils/DELink";
import { useTeamsSearch } from "../search/searchQueries";
import WrappedErrorHandler from "../error/WrappedErrorHandler";
import ErrorTypographyWithDialog from "../error/ErrorTypographyWithDialog";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

function Columns(t) {
    return {
        NAME: { fieldName: t("name"), key: "display_extension" },
        CREATOR: {
            fieldName: t("creator"),
            key: "detail.created_by_detail.name",
        },
        DESCRIPTION: { fieldName: t("description"), key: "description" },
        DETAILS: { fieldName: "", key: "name" },
    };
}

function Listing(props) {
    const {
        parentId,
        teamFilter,
        searchTerm,
        onTeamNameSelected,
        updateResultCount,
    } = props;

    const { t } = useTranslation(["teams", "search"]);
    const [data, setData] = useState([]);
    const [userProfile] = useUserProfile();

    const tableId = buildID(parentId, ids.TEAMS.TABLE);
    const TEAM_COLUMNS = Columns(t);
    const isSearchPage = !!searchTerm;

    const columns = useMemo(() => {
        const baseColumns = [
            {
                Header: TEAM_COLUMNS.NAME.fieldName,
                accessor: TEAM_COLUMNS.NAME.key,
                Cell: ({ row, value }) => {
                    const team = row.original;
                    const rowId = buildID(tableId, team.id);
                    return (
                        <DELink
                            id={buildID(rowId, ids.TEAMS.LINK)}
                            onClick={() => onTeamNameSelected(team.name)}
                            searchTerm={searchTerm}
                            text={value}
                        />
                    );
                },
            },
            {
                Header: TEAM_COLUMNS.CREATOR.fieldName,
                accessor: TEAM_COLUMNS.CREATOR.key,
            },
            {
                Header: TEAM_COLUMNS.DESCRIPTION.fieldName,
                accessor: TEAM_COLUMNS.DESCRIPTION.key,
            },
        ];

        return !isSearchPage
            ? baseColumns
            : [
                  ...baseColumns,
                  {
                      Header: TEAM_COLUMNS.DETAILS.fieldName,
                      accessor: TEAM_COLUMNS.DETAILS.key,
                      defaultCanSort: false,
                      Cell: ({ row }) => {
                          const team = row.original;
                          return (
                              <IconButton
                                  onClick={() =>
                                      console.log(
                                          "Show details for",
                                          team.display_extension
                                      )
                                  }
                                  size="small"
                                  color="primary"
                                  title={t("details")}
                              >
                                  <Info fontSize="small" />
                              </IconButton>
                          );
                      },
                  },
              ];
    }, [
        tableId,
        TEAM_COLUMNS,
        onTeamNameSelected,
        isSearchPage,
        searchTerm,
        t,
    ]);

    const { isFetching: fetchMyTeams, error: myTeamsError } = useQuery({
        queryKey: [MY_TEAMS_QUERY, { userId: userProfile?.id }],
        queryFn: () => getMyTeams({ userId: userProfile?.id }),
        enabled: TEAM_FILTER.MY_TEAMS === teamFilter && !searchTerm,
        onSuccess: (results) => {
            trackIntercomEvent(IntercomEvents.VIEWED_MY_TEAMS);
            setData(results.groups);
        },
    });

    const { isFetching: fetchAllTeams, error: allTeamsError } = useQuery({
        queryKey: [ALL_TEAMS_QUERY, userProfile?.id],
        queryFn: getAllTeams,
        enabled: TEAM_FILTER.ALL_TEAMS === teamFilter && !searchTerm,
        onSuccess: (results) => {
            trackIntercomEvent(IntercomEvents.VIEWED_ALL_TEAMS);
            setData(results.groups);
        },
    });

    const { isFetching: fetchSearchResults, error: searchError } =
        useTeamsSearch(
            [SEARCH_TEAMS_QUERY, { searchTerm }],
            searchTerm && searchTerm.length > 2,
            (results) => {
                const teams = results.groups;
                trackIntercomEvent(IntercomEvents.SEARCHED_TEAMS, {
                    search: searchTerm,
                    total: teams.length,
                });
                setData(teams);
                updateResultCount && updateResultCount(teams.length);
            }
        );

    const loading = isQueryLoading([
        fetchMyTeams,
        fetchAllTeams,
        fetchSearchResults,
    ]);

    const error = allTeamsError || myTeamsError || searchError;

    if (loading) {
        return (
            <Table>
                <TableLoading
                    baseId={tableId}
                    numColumns={Object.keys(TEAM_COLUMNS).length}
                    numRows={5}
                />
            </Table>
        );
    }

    if (error) {
        return !isSearchPage ? (
            <WrappedErrorHandler errorObject={error} baseId={parentId} />
        ) : (
            <ErrorTypographyWithDialog
                errorMessage={t("search:errorSearch")}
                errorObject={error}
                baseId={parentId}
            />
        );
    }

    if (!data || data.length === 0) {
        return (
            <Table>
                <TableBody>
                    <EmptyTable
                        message={t("noTeams")}
                        numColumns={Object.keys(TEAM_COLUMNS).length}
                    />
                </TableBody>
            </Table>
        );
    }

    return <BasicTable columns={columns} data={data} sortable />;
}

export default Listing;
