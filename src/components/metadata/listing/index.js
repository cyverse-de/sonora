/**
 * @author psarando
 */
import React from "react";

import { getIn } from "formik";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import constants from "../../../constants";

import ids from "../ids";
import styles from "../styles";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import TableLoading from "components/table/TableLoading";
import DETableHead from "components/table/DETableHead";

import buildID from "components/utils/DebugIDUtil";
import { stableSort, getSorting } from "components/table/TableSort";
import DECheckbox from "components/utils/DECheckbox";

import {
    ButtonGroup,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import {
    Add as ContentAdd,
    Delete as ContentRemove,
    Edit as ContentEdit,
    List as ContentView,
} from "@mui/icons-material";

const useStyles = makeStyles()(styles);

const MetadataGridToolbar = (props) => {
    const { parentID, editable, onAddAVU } = props;

    const { t } = useTranslation("metadata");
    const { classes } = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Toolbar>
            <Typography
                id={buildID(parentID, ids.TITLE)}
                variant="h6"
                className={classes.avuListingTitle}
            >
                {t("avus")}
            </Typography>
            {editable &&
                (isMobile ? (
                    <IconButton
                        id={buildID(parentID, ids.BUTTONS.ADD)}
                        color="primary"
                        aria-label={t("addMetadata")}
                        onClick={onAddAVU}
                        size="large"
                    >
                        <ContentAdd />
                    </IconButton>
                ) : (
                    <Button
                        id={buildID(parentID, ids.BUTTONS.ADD)}
                        color="primary"
                        variant="outlined"
                        startIcon={<ContentAdd />}
                        onClick={onAddAVU}
                    >
                        {t("addMetadata")}
                    </Button>
                ))}
        </Toolbar>
    );
};

MetadataGridToolbar.propTypes = {
    onAddAVU: PropTypes.func.isRequired,
};

const columnData = (t) => [
    {
        id: buildID(ids.COL_HEADER, ids.AVU_ATTR),
        key: "attr",
        name: t("attribute"),
        enableSorting: true,
    },
    {
        id: buildID(ids.COL_HEADER, ids.AVU_VALUE),
        key: "value",
        name: t("value"),
        enableSorting: true,
    },
    {
        id: buildID(ids.COL_HEADER, ids.AVU_UNIT),
        key: "unit",
        name: t("metadataUnitLabel"),
        enableSorting: true,
    },
    {
        id: buildID(ids.COL_HEADER, ids.AVU_AVUS),
        key: "avus",
        name: t("metadataChildrenLabel"),
        enableSorting: true,
        numeric: true,
        padding: "none",
    },
    {
        id: buildID(ids.COL_HEADER, ids.COL_ACTIONS),
        key: "actions",
        enableSorting: false,
        padding: "none",
    },
];

const AVURow = ({
    editable,
    selectable,
    rowID,
    selected,
    attr,
    value,
    unit,
    avuChildCount,
    onRowSelect,
    onRowEdit,
    onRowDelete,
}) => {
    const { t } = useTranslation("common");
    const { classes } = useStyles();

    return (
        <TableRow hover tabIndex={-1} selected={selected}>
            {selectable && (
                <TableCell padding="checkbox">
                    <DECheckbox
                        id={buildID(rowID, ids.AVU_GRID_CHECKBOX)}
                        checked={selected}
                        onChange={onRowSelect}
                    />
                </TableCell>
            )}
            <TableCell component="th" scope="row">
                {attr}
            </TableCell>
            <TableCell>{value}</TableCell>
            <TableCell>{unit}</TableCell>
            <TableCell align="right">{avuChildCount}</TableCell>
            <TableCell>
                <ButtonGroup variant="text">
                    <Button
                        id={buildID(rowID, ids.BUTTONS.EDIT)}
                        aria-label={editable ? t("edit") : t("view")}
                        className={classes.button}
                        onClick={(event) => {
                            event.stopPropagation();
                            onRowEdit();
                        }}
                    >
                        {editable ? <ContentEdit /> : <ContentView />}
                    </Button>
                    {editable && (
                        <Button
                            id={buildID(rowID, ids.BUTTONS.DELETE)}
                            aria-label={t("delete")}
                            className={classes.deleteIcon}
                            onClick={(event) => {
                                event.stopPropagation();
                                onRowDelete();
                            }}
                        >
                            <ContentRemove />
                        </Button>
                    )}
                </ButtonGroup>
            </TableCell>
        </TableRow>
    );
};

const MetadataList = (props) => {
    const {
        parentID,
        editable,
        loading,
        fetchError,
        selectable,
        onEditAVU,
        onSelectAVU,
        onSelectAllClick,
        avusSelected,
        rowsInPage,
        name,
        form: { values },
        remove,
        unshift,
    } = props;

    const [newAttrCount, setNewAttrCount] = React.useState(1);
    const [orderBy, setOrderBy] = React.useState(props.orderBy);
    const [order, setOrder] = React.useState(
        props.order || constants.SORT_ASCENDING
    );

    const { t } = useTranslation("metadata");

    const { classes } = useStyles();

    const onAddAVU = () => {
        const avus = getIn(values, name) || [];

        let newAttrName,
            count = newAttrCount;

        // Increment the new attribute name count
        // until an attribute with that count in its name
        // is not found in the current list of AVUs.
        const namesMatch = (avu) => avu.attr === newAttrName;
        do {
            newAttrName = t("newAttrName", {
                count,
            });
            count++;
        } while (avus.find(namesMatch));

        // Cache the next new attribute name count.
        setNewAttrCount(count);

        // Add the new AVU to the form's list.
        unshift({
            attr: newAttrName,
            value: "",
            unit: "",
        });
    };

    const handleRequestSort = (event, property) => {
        let newOrder = constants.SORT_ASCENDING;

        if (orderBy === property && order === newOrder) {
            newOrder = constants.SORT_DESCENDING;
        }

        setOrder(newOrder);
        setOrderBy(property);
    };

    const avus = getIn(values, name);
    const tableID = buildID(parentID, ids.AVU_GRID);

    // A copy of the list of AVUs, but including only each AVU's sortable fields,
    // along with a TableRow component for rendering within the returned Table below.
    // This will allow the TableRows to be sorted without altering the original AVU list,
    // which also allows each AVU's original index in the metadata model to be preserved
    // and used in the form editing functions.
    const unsortedAVURows =
        avus &&
        avus.map((avu, index) => {
            const { attr, value, unit, avus } = avu;

            const field = `${name}[${index}]`;

            const rowID = buildID(ids.EDIT_METADATA_FORM, field);

            const selected = avusSelected && avusSelected.includes(avu);
            const avuChildCount = avus ? avus.length : 0;

            // This returned object should include each sortable field defined by columnData above,
            // in addition to the TableRow component.
            return {
                attr,
                value,
                unit,
                // This field only requires the length of the original AVU's children, for TableRow sorting purposes.
                avus: avuChildCount,
                // Include the TableRow component that will be rendered within the final Table component.
                tableRow: (
                    <AVURow
                        key={field}
                        editable={editable}
                        selectable={selectable}
                        rowID={rowID}
                        selected={selected}
                        attr={attr}
                        value={value}
                        unit={unit}
                        avuChildCount={avuChildCount}
                        onRowSelect={(event, checked) =>
                            onSelectAVU(avu, checked)
                        }
                        onRowEdit={() => onEditAVU(index)}
                        onRowDelete={() => remove(index)}
                    />
                ),
            };
        });

    // Only sort the TableRows if sorting has been requested.
    const sortedAVURows = orderBy
        ? stableSort(unsortedAVURows, getSorting(order, orderBy))
        : unsortedAVURows;

    if (fetchError) {
        return (
            <WrappedErrorHandler errorObject={fetchError} baseId={tableID} />
        );
    }

    return (
        <>
            <MetadataGridToolbar
                parentID={tableID}
                editable={editable}
                onAddAVU={onAddAVU}
            />

            <TableContainer
                component={Paper}
                className={classes.metadataTableContainer}
            >
                <Table aria-labelledby={buildID(tableID, ids.TITLE)}>
                    {loading ? (
                        <TableLoading
                            baseId={ids.EDIT_METADATA_FORM}
                            numColumns={5}
                            numRows={5}
                        />
                    ) : (
                        <TableBody>
                            {sortedAVURows &&
                                sortedAVURows.map((row) => row.tableRow)}
                        </TableBody>
                    )}
                    <DETableHead
                        baseId={tableID}
                        columnData={columnData(t)}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        selectable={selectable}
                        onSelectAllClick={onSelectAllClick}
                        numSelected={avusSelected ? avusSelected.length : 0}
                        rowsInPage={rowsInPage}
                    />
                </Table>
            </TableContainer>
        </>
    );
};

export default MetadataList;
