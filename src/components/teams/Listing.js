import React, { useEffect, useState } from "react";

import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    getSorting,
    stableSort,
} from "@cyverse-de/ui-lib";
import { Table, TableBody, TableCell } from "@material-ui/core";

import ids from "./ids";
import { useTranslation } from "i18n";
import TableLoading from "../utils/TableLoading";
import SpanLink from "../data/listing/SpanLink";
import constants from "constants.js";
import { DERow } from "../utils/DERow";
import { useQuery } from "react-query";
import {
    ALL_TEAMS_QUERY,
    getAllTeams,
    getMyTeams,
    MY_TEAMS_QUERY,
} from "serviceFacades/groups";
import { TEAM_FILTER } from "./index";
import { useUserProfile } from "contexts/userProfile";
import isQueryLoading from "../utils/isQueryLoading";

const TABLE_COLUMNS = [
    {
        name: "Name",
        align: "left",
        enableSorting: true,
        key: "display_extension",
    },
    {
        name: "Creator Name",
        align: "left",
        enableSorting: true,
        key: "creator",
    },
    { name: "Description", align: "left", enableSorting: false },
];

function Listing(props) {
    const {
        parentId,
        teamFilter,
        onTeamNameSelected,
        isSelectable = true,
    } = props;

    const { t } = useTranslation("teams");
    const [data, setData] = useState([]);
    const [userProfile] = useUserProfile();

    const tableId = build(parentId, ids.TEAMS.TABLE);

    const [order, setOrder] = useState(constants.SORT_ASCENDING);
    const [orderBy, setOrderBy] = useState("display_extension");

    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);

    const { isFetching: fetchMyTeams } = useQuery({
        queryKey: [MY_TEAMS_QUERY, { userId: userProfile?.id }],
        queryFn: getMyTeams,
        config: {
            enabled: TEAM_FILTER.MY_TEAMS === teamFilter,
            onSuccess: (results) => setData(results.groups),
        },
    });

    const { isFetching: fetchAllTeams } = useQuery({
        queryKey: [ALL_TEAMS_QUERY, userProfile?.id],
        queryFn: getAllTeams,
        config: {
            enabled: TEAM_FILTER.ALL_TEAMS === teamFilter,
            onSuccess: (results) => setData(results.groups),
        },
    });

    useEffect(() => {
        setSelected([]);
    }, [teamFilter]);

    const onRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const onSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds = data?.map((team) => team.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const rangeSelect = (start, end, targetId) => {
        if (start > -1) {
            const rangeIds = [];
            for (let i = start; i <= end; i++) {
                rangeIds.push(data[i].id);
            }

            let isTargetSelected = selected.includes(targetId);
            isTargetSelected ? deselect(rangeIds) : select(rangeIds);
        }
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, id)
                : rangeSelect(lastSelectIndex, index, id);
        } else {
            setSelected([id]);
        }

        setLastSelectIndex(index);
    };

    const handleCheckboxClick = (event, id, index) => {
        toggleSelection(id);
        setLastSelectIndex(index);
    };

    const toggleSelection = (resourceId) => {
        if (selected.includes(resourceId)) {
            deselect([resourceId]);
        } else {
            select([resourceId]);
        }
    };

    const select = (resourceIds) => {
        let newSelected = [...new Set([...selected, ...resourceIds])];
        setSelected(newSelected);
    };

    const deselect = (resourceIds) => {
        const newSelected = selected.filter(
            (selectedID) => !resourceIds.includes(selectedID)
        );

        setSelected(newSelected);
    };

    const loading = isQueryLoading([fetchMyTeams, fetchAllTeams]);

    if (loading) {
        return (
            <Table>
                <TableLoading
                    baseId={tableId}
                    numColumns={TABLE_COLUMNS.length}
                    numRows={5}
                />
            </Table>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Table>
                <TableBody>
                    <EmptyTable
                        message={t("noTeams")}
                        numColumns={TABLE_COLUMNS.length}
                    />
                </TableBody>
            </Table>
        );
    }

    return (
        <Table>
            <TableBody>
                {stableSort(data, getSorting(order, orderBy)).map(
                    (team, index) => {
                        const teamId = team.id;
                        const isSelected =
                            isSelectable && selected.includes(teamId);
                        const rowId = build(tableId, teamId);
                        return (
                            <DERow
                                role="checkbox"
                                tabIndex={0}
                                hover
                                id={rowId}
                                key={team.id}
                                selected={isSelected}
                                onClick={(event) =>
                                    handleClick(event, teamId, index)
                                }
                            >
                                {isSelectable && (
                                    <TableCell padding="checkbox">
                                        <DECheckbox
                                            checked={isSelected}
                                            id={build(
                                                rowId,
                                                ids.TEAMS.CHECKBOX
                                            )}
                                            onChange={(event) =>
                                                handleCheckboxClick(
                                                    event,
                                                    teamId,
                                                    index
                                                )
                                            }
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <SpanLink
                                        id={build(rowId, ids.TEAMS.LINK)}
                                        onClick={() => onTeamNameSelected(team)}
                                    >
                                        {team.display_extension}
                                    </SpanLink>
                                </TableCell>
                                <TableCell>
                                    {team.detail.created_by_detail.name}
                                </TableCell>
                                <TableCell>{team.description}</TableCell>
                            </DERow>
                        );
                    }
                )}
            </TableBody>
            <EnhancedTableHead
                selectable={isSelectable}
                numSelected={selected.length}
                onSelectAllClick={onSelectAllClick}
                rowsInPage={data?.length}
                order={order}
                orderBy={orderBy}
                baseId={parentId}
                columnData={TABLE_COLUMNS}
                onRequestSort={onRequestSort}
            />
        </Table>
    );
}

export default Listing;
