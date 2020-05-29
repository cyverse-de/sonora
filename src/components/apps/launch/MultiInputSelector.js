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
    EmptyTable,
    EnhancedTableHead,
} from "@cyverse-de/ui-lib";

import {
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
    Tooltip,
    Typography,
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
        helperText,
        required,
        acceptedType,
        startingPath,
        field: { name },
        form: { values, touched, errors, setFieldValue },
    } = props;

    const columnData = multiInputColumnData(intl);
    const nameColumn = columnData[0];

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

    return (
        <FieldArray name={name}>
            {(arrayHelpers) => {
                return (
                    <>
                        <Toolbar disableGutters>
                            <FormControl
                                fullWidth
                                variant="outlined"
                                error={!!errorMsg}
                            >
                                <FormLabel
                                    id={tableLabelID}
                                    required={required}
                                >
                                    {label}
                                </FormLabel>
                                <FormHelperText>
                                    {errorMsg || helperText}
                                </FormHelperText>
                            </FormControl>
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
                                    selectable={false}
                                    rowsInPage={paths?.length || 0}
                                    order={order}
                                    orderBy={nameColumn.key}
                                    baseId={tableId}
                                    columnData={columnData}
                                    onRequestSort={onRequestSort}
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
                                            const rowID = buildDebugId(
                                                id,
                                                index
                                            );

                                            return (
                                                <MultiInputRow
                                                    key={rowID}
                                                    id={rowID}
                                                    path={path}
                                                    onRowDeleted={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
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

const MultiInputRow = injectIntl(({ intl, id, path, onRowDeleted }) => (
    <TableRow id={id} hover>
        <TableCell>
            <Tooltip title={path}>
                <Typography>{getPathBaseName(path)}</Typography>
            </Tooltip>
        </TableCell>
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
));

export default injectIntl(withI18N(MultiInputSelector, messages));
