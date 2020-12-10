import React, { useState } from "react";

import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    stableSort,
    getSorting,
} from "@cyverse-de/ui-lib";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

import ids from "./ids";
import { useTranslation } from "i18n";
import TableLoading from "../utils/TableLoading";
import SpanLink from "../data/listing/SpanLink";
import constants from "../../constants";

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
    const { parentId, loading, data, onTeamNameSelected, isSelectable } = props;

    const { t } = useTranslation("teams");
    const tableId = build(parentId, ids.TEAMS.TABLE);

    const [order, setOrder] = useState(constants.SORT_ASCENDING);
    const [orderBy, setOrderBy] = useState("display_extension");

    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);

    const onRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const onSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds = data?.map((resource) => resource.id) || [];
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

    if (loading) {
        return (
            <TableLoading
                baseId={tableId}
                numColumns={TABLE_COLUMNS.length}
                numRows={5}
            />
        );
    }

    if (!data || data.length === 0) {
        return (
            <EmptyTable
                message={t("noTeams")}
                numColumns={TABLE_COLUMNS.length}
            />
        );
    }

    return (
        <Table>
            <TableBody>
                {stableSort(data, getSorting(order, orderBy)).map(
                    (team, index) => {
                        const isSelected =
                            isSelectable && selected.includes(team);
                        const teamId = team.id;
                        const rowId = build(tableId, team.id);
                        return (
                            <TableRow
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
                            </TableRow>
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
