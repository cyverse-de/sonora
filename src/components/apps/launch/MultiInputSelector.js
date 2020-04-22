/**
 * @author psarando
 *
 * Multi-Input Selector form field for picking many paths from the data store.
 */
import React from "react";

import { FieldArray, getIn } from "formik";
import { injectIntl } from "react-intl";

import constants from "./constants";
import ids from "./ids";
import messages from "./messages";

import { BrowseButton } from "./InputSelector";

import {
    build as buildDebugId,
    getFormError,
    getMessage,
    formatMessage,
    stableSort,
    withI18N,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
} from "@cyverse-de/ui-lib";

import {
    Button,
    IconButton,
    FormControl,
    FormHelperText,
    FormLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Toolbar,
} from "@material-ui/core";

import ClearIcon from "@material-ui/icons/Clear";

const multiInputColumnData = (intl) => [
    {
        key: "name",
        id: constants.PARAM_TYPE.MULTIFILE_SELECTOR,
        name: formatMessage(intl, "name"),
        numeric: false,
        enableSorting: true,
    },
    {
        name: "",
        numeric: false,
        enableSorting: false,
    },
];

const getPathBaseName = (path) => path.replace(/.*\//, "");

const comparePathNames = (a, b) =>
    getPathBaseName(a).localeCompare(getPathBaseName(b));

const getSortedPaths = (order, paths) => {
    if (order === "asc") {
        return stableSort(paths, (a, b) => comparePathNames(a, b));
    }

    return stableSort(paths, (a, b) => comparePathNames(b, a));
};

/**
 * A Multi-Input Selector form field for adding and removing file paths
 * for multi-input app parameters.
 */
const MultiInputSelector = (props) => {
    const {
        intl,
        id,
        label,
        required,
        acceptedType,
        startingPath,
        field: { name },
        form: { values, touched, errors, setFieldValue },
    } = props;

    const columnData = multiInputColumnData(intl);
    const nameColumn = columnData[0];

    const [selected, setSelected] = React.useState([]);
    const [lastSelectedIndex, setLastSelectedIndex] = React.useState(-1);
    const [order, setOrder] = React.useState("asc");

    const paths = getIn(values, name);
    const errorMsg = getFormError(name, touched, errors);

    const tableId = buildDebugId(id, "table");
    const tableLabelID = buildDebugId(tableId, "tableLabel");

    const onRequestSort = (event, property) => {
        const newOrder = order === "desc" ? "asc" : "desc";
        setOrder(newOrder);
        setFieldValue(name, getSortedPaths(newOrder, paths));
    };

    const onSelectAllClick = (event, checked) => {
        const selectAll = checked && !selected.length;
        setSelected(selectAll ? paths : []);
        setLastSelectedIndex(-1);
    };

    const onRowSelected = (event, path, index) => {
        if (event.shiftKey && lastSelectedIndex !== index) {
            lastSelectedIndex > index
                ? rangeSelect(index, lastSelectedIndex, path)
                : rangeSelect(lastSelectedIndex, index, path);
        } else {
            toggleSelection(path);
        }

        setLastSelectedIndex(index);
    };

    const rangeSelect = (start, end, path) => {
        const newSelectionRange = paths.slice(start, end + 1);
        if (selected.includes(path)) {
            deselect(newSelectionRange);
        } else {
            select(newSelectionRange);
        }
    };

    const select = (paths) => {
        setSelected([...new Set([...selected, ...paths])]);
    };

    const deselect = (paths) => {
        setSelected(selected.filter((path) => !paths.includes(path)));
    };

    const toggleSelection = (path) => {
        if (selected.includes(path)) {
            deselect([path]);
        } else {
            select([path]);
        }
    };

    return (
        <FieldArray name={name}>
            {(arrayHelpers) => {
                return (
                    <>
                        <Toolbar disableGutters>
                            <FormControl fullWidth error={!!errorMsg}>
                                <FormLabel
                                    id={tableLabelID}
                                    required={required}
                                >
                                    {label}
                                </FormLabel>
                                <FormHelperText>{errorMsg}</FormHelperText>
                            </FormControl>
                            {!!selected.length && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<ClearIcon />}
                                    onClick={() => {
                                        setSelected([]);

                                        const filteredPaths = paths.filter(
                                            (path) => !selected.includes(path)
                                        );

                                        setFieldValue(
                                            name,
                                            getSortedPaths(order, filteredPaths)
                                        );
                                    }}
                                >
                                    {getMessage("multiInputRemoveSelected")}
                                </Button>
                            )}
                            <BrowseButton
                                baseId={id}
                                startingPath={startingPath}
                                acceptedType={acceptedType}
                                multiSelect={true}
                                onConfirm={(selections) => {
                                    setFieldValue(
                                        name,
                                        getSortedPaths(order, [
                                            ...new Set([
                                                ...selections,
                                                ...paths,
                                            ]),
                                        ])
                                    );
                                }}
                            />
                        </Toolbar>
                        <TableContainer
                            component={Paper}
                            style={{
                                height: "55vh",
                            }}
                        >
                            <Table
                                id={tableId}
                                stickyHeader={true}
                                size="small"
                                aria-labelledby={tableLabelID}
                            >
                                <EnhancedTableHead
                                    selectable={true}
                                    numSelected={selected.length}
                                    rowsInPage={paths?.length || 0}
                                    order={order}
                                    orderBy={nameColumn.key}
                                    baseId={tableId}
                                    columnData={columnData}
                                    onRequestSort={onRequestSort}
                                    onSelectAllClick={onSelectAllClick}
                                />
                                <TableBody>
                                    {!paths?.length ? (
                                        <EmptyTable
                                            message={getMessage(
                                                "multiInputEmptyLabel"
                                            )}
                                            numColumns={3}
                                        />
                                    ) : (
                                        paths?.map((path, index) => {
                                            const pathBaseName = getPathBaseName(
                                                path
                                            );
                                            const rowID = buildDebugId(
                                                id,
                                                index
                                            );

                                            return (
                                                <MultiInputRow
                                                    key={rowID}
                                                    id={rowID}
                                                    selected={selected.includes(
                                                        path
                                                    )}
                                                    inputName={pathBaseName}
                                                    onRowSelected={(event) =>
                                                        onRowSelected(
                                                            event,
                                                            path,
                                                            index
                                                        )
                                                    }
                                                    onRowDeleted={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        deselect([path]);
                                                        arrayHelpers.remove(
                                                            index
                                                        );
                                                    }}
                                                />
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                );
            }}
        </FieldArray>
    );
};

const MultiInputRow = injectIntl(
    ({ intl, id, inputName, selected, onRowDeleted, onRowSelected }) => (
        <TableRow
            id={id}
            role="checkbox"
            hover
            selected={selected}
            aria-checked={selected}
            onClick={onRowSelected}
        >
            <TableCell padding="checkbox">
                <DECheckbox
                    checked={selected}
                    tabIndex={0}
                    id={buildDebugId(id, ids.checkbox)}
                    inputProps={{
                        "aria-label": formatMessage(
                            intl,
                            "multiInputCheckboxLabel",
                            {
                                label: inputName,
                            }
                        ),
                    }}
                />
            </TableCell>
            <TableCell>{inputName}</TableCell>
            <TableCell align="right">
                <IconButton
                    id={buildDebugId(id, ids.BUTTONS.DELETE)}
                    aria-label={formatMessage(intl, "delete")}
                    onClick={onRowDeleted}
                >
                    <ClearIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
);

export default injectIntl(withI18N(MultiInputSelector, messages));
