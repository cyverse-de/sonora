/**
 * @author psarando
 *
 * Multi-Input Selector form field for picking many paths from the data store.
 */
import React from "react";

import { FieldArray, getIn } from "formik";
import { useTranslation } from "i18n";

import constants from "./constants";
import ids from "./ids";

import { BrowseButton } from "./InputSelector";

import globalConstants from "../../../constants";
import DETableHead from "components/utils/DETableHead";

import {
    build as buildDebugId,
    getFormError,
    stableSort,
    EmptyTable,
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
    useTheme,
} from "@material-ui/core";

import ClearIcon from "@material-ui/icons/Clear";

const multiInputColumnData = (t) => [
    {
        key: "name",
        id: constants.PARAM_TYPE.MULTIFILE_SELECTOR,
        name: t("name"),
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
    if (order === globalConstants.SORT_ASCENDING) {
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
        id,
        label,
        helperText,
        required,
        acceptedType,
        startingPath,
        height = "55vh",
        field: { name },
        form: { values, touched, errors, setFieldValue },
    } = props;
    const { t } = useTranslation("launch");
    const columnData = multiInputColumnData(t);
    const nameColumn = columnData[0];

    const [order, setOrder] = React.useState(globalConstants.SORT_ASCENDING);

    const paths = getIn(values, name);
    const errorMsg = getFormError(name, touched, errors);

    const tableId = buildDebugId(id, "table");
    const tableLabelID = buildDebugId(tableId, "tableLabel");

    const theme = useTheme();

    const onRequestSort = (event, property) => {
        const newOrder =
            order === globalConstants.SORT_DESCENDING
                ? globalConstants.SORT_ASCENDING
                : globalConstants.SORT_DESCENDING;
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
                                        paths
                                            ? getSortedPaths(order, [
                                                  ...new Set([
                                                      ...selections,
                                                      ...paths,
                                                  ]),
                                              ])
                                            : getSortedPaths(order, selections)
                                    );
                                }}
                            />
                        </Toolbar>
                        <TableContainer
                            component={Paper}
                            style={{
                                height,
                            }}
                        >
                            <Table
                                id={tableId}
                                stickyHeader={true}
                                size="small"
                                aria-labelledby={tableLabelID}
                                padding="none"
                            >
                                <DETableHead
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
                                            message={
                                                <Typography
                                                    variant="body2"
                                                    style={{
                                                        padding: theme.spacing(
                                                            0.5
                                                        ),
                                                    }}
                                                >
                                                    {t("multiInputEmptyLabel")}
                                                </Typography>
                                            }
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

const MultiInputRow = ({ id, path, onRowDeleted }) => {
    const { t } = useTranslation("launch");
    const theme = useTheme();
    return (
        <TableRow id={id} hover>
            <TableCell>
                <Tooltip title={path}>
                    <Typography
                        variant="body2"
                        style={{ padding: theme.spacing(0.5) }}
                    >
                        {getPathBaseName(path)}
                    </Typography>
                </Tooltip>
            </TableCell>
            <TableCell align="right">
                <IconButton
                    id={buildDebugId(id, ids.BUTTONS.DELETE)}
                    aria-label={t("delete")}
                    onClick={onRowDeleted}
                    size="small"
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default MultiInputSelector;
