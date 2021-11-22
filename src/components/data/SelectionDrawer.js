/**
 * @author aramsey
 *
 * A Drawer component used for enabling the user to pick data
 * resources as input to other components.
 */

import React, { useEffect, useRef, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    Button,
    Drawer,
    IconButton,
    InputAdornment,
    makeStyles,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Directions } from "@material-ui/icons";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ids from "./ids";
import Listing from "components/data/listing/Listing";
import ResourceTypes from "../models/ResourceTypes";

import styles from "./styles";
import constants from "../../constants";
import useComponentHeight from "../utils/useComponentHeight";
import { DEFAULT_PAGE_SETTINGS } from "components/data/utils";
import { getLocalStorage } from "components/utils/localStorage";

import FolderIcon from "@material-ui/icons/Folder";

const useStyles = makeStyles(styles);

const PAGINATION_BAR_HEIGHT = 60;

function getInvalidSelectionCount(
    getSelectedResources,
    acceptedType,
    acceptedInfoTypes,
    multiSelect
) {
    const selectedResources = getSelectedResources();
    const allowSelectionByInfoTypes =
        acceptedInfoTypes && acceptedInfoTypes?.length > 0;
    const invalidInfoTypeSelections = allowSelectionByInfoTypes
        ? selectedResources.filter(
              (resource) => !acceptedInfoTypes?.includes(resource?.infoType)
          ).length
        : 0;
    let invalidTotal = 0;

    switch (acceptedType) {
        case ResourceTypes.FILE:
            //for file inputs, we want all the selections to be of 'file' type
            // and in one of the accepted info types if specified
            invalidTotal =
                selectedResources.filter(
                    (resource) => resource.type.toLowerCase() !== acceptedType
                ).length || invalidInfoTypeSelections;
            break;
        case ResourceTypes.FOLDER:
            if (!multiSelect) {
                const selectedType = selectedResources[0]?.type;
                //for single folder input selection for Apps,
                //we allow either HT-Path-list file or a single folder as input
                if (allowSelectionByInfoTypes) {
                    if (
                        invalidInfoTypeSelections > 0 &&
                        selectedType !== ResourceTypes.FOLDER
                    ) {
                        invalidTotal = 1;
                    }
                } else {
                    // in other places like Move or Preferences default output folder selection
                    // we only allow folders
                    if (selectedType !== ResourceTypes.FOLDER) {
                        invalidTotal = 1;
                    }
                }
            } else {
                //we support info type selections for multi-select folders
                invalidTotal = selectedResources.filter(
                    (resource) => resource.type.toLowerCase() !== acceptedType
                ).length;
            }
            break;
        default:
        //ResourceTypes.ANY - do nothing
    }

    return invalidTotal;
}

function SelectionToolbar(props) {
    const {
        baseId,
        currentPath,
        setCurrentPath,
        selectedTotal,
        getSelectedResources,
        onConfirm,
        onClose,
        acceptedType,
        multiSelect,
        setToolbarRef,
        acceptedInfoTypes,
    } = props;
    const theme = useTheme();
    const classes = useStyles();
    const { t } = useTranslation("data");
    const [displayPath, setDisplayPath] = useState("");
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const toolbarRef = useRef(null);

    // useEffect will run on toolbarRef value assignment
    useEffect(() => {
        setToolbarRef(toolbarRef);
    }, [toolbarRef, setToolbarRef]);

    useEffect(() => {
        setDisplayPath(currentPath);
    }, [currentPath]);

    const selectedResources = getSelectedResources();

    // Only return the paths to each resource, not the full resource object
    // The path key includes the file name if it's a file
    const handleConfirm = () => {
        if (multiSelect) {
            onConfirm(selectedResources);
        } else {
            onConfirm(selectedResources[0].path);
        }
    };

    const handleCurrentFolderConfirm = () => {
        onConfirm(currentPath);
    };
    const invalidTotal = getInvalidSelectionCount(
        getSelectedResources,
        acceptedType,
        acceptedInfoTypes,
        multiSelect
    );
    const hasValidSelection = Boolean(selectedTotal && !invalidTotal);
    const hasInvalidSelection = selectedTotal && invalidTotal;

    const Buttons = () => {
        return (
            <>
                <Button
                    id={buildID(baseId, ids.SELECTION_TOOLBAR, ids.CANCEL_BTN)}
                    onClick={onClose}
                    variant="outlined"
                    style={{
                        margin: isMobile
                            ? theme.spacing(0.5)
                            : theme.spacing(1),
                    }}
                    size="small"
                >
                    {t("cancel")}
                </Button>

                {acceptedType === ResourceTypes.FOLDER && selectedTotal === 0 && (
                    <>
                        <Button
                            startIcon={<FolderIcon />}
                            id={buildID(
                                baseId,
                                ids.CURRENT_FOLDER_BTN,
                                ids.FOLDER
                            )}
                            color={"primary"}
                            onClick={handleCurrentFolderConfirm}
                            variant="outlined"
                            style={{
                                margin: isMobile
                                    ? theme.spacing(0.5)
                                    : theme.spacing(1),
                            }}
                            size="small"
                        >
                            {t("selCurrentFolder")}
                        </Button>
                    </>
                )}
                {hasValidSelection && (
                    <Button
                        id={buildID(baseId, ids.SELECTION_TOOLBAR, ids.OK_BTN)}
                        color={"primary"}
                        onClick={handleConfirm}
                        variant="contained"
                        style={{
                            margin: isMobile
                                ? theme.spacing(0.5)
                                : theme.spacing(1),
                        }}
                        size="small"
                    >
                        {t("ok")}
                    </Button>
                )}
            </>
        );
    };

    return (
        <>
            <Toolbar
                id={buildID(baseId, ids.SELECTION_TOOLBAR)}
                ref={toolbarRef}
            >
                {hasValidSelection ? (
                    <Typography color="primary" variant="h6">
                        {t("selectedItems", { count: selectedTotal })}
                    </Typography>
                ) : hasInvalidSelection ? (
                    <Typography
                        variant="h6"
                        style={{ color: theme.palette.error.main }}
                    >
                        {t("invalidSelection", {
                            context: acceptedType,
                            count: invalidTotal,
                        })}
                    </Typography>
                ) : (
                    <Typography variant="h6">
                        {t("selectionSuggestion", {
                            context: acceptedType,
                            count: multiSelect ? 0 : 1,
                        })}
                    </Typography>
                )}
                <div className={classes.divider} />
                {!isMobile && <Buttons />}
            </Toolbar>
            {isMobile && (
                <Toolbar>
                    <Buttons />
                </Toolbar>
            )}
            <Toolbar>
                <TextField
                    id={buildID(baseId, ids.DATA_PATH)}
                    label={t("path")}
                    value={displayPath}
                    onChange={(event) => setDisplayPath(event.target.value)}
                    variant="outlined"
                    fullWidth={true}
                    margin="dense"
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            setCurrentPath(displayPath);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    id={buildID(
                                        baseId,
                                        ids.DATA_PATH,
                                        ids.DATA_PATH_CHANGE_BTN
                                    )}
                                    size="small"
                                    color="primary"
                                    onClick={() => setCurrentPath(displayPath)}
                                >
                                    <Directions />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Toolbar>
        </>
    );
}

function SelectionDrawer(props) {
    const {
        startingPath,
        acceptedType = ResourceTypes.ANY,
        acceptedInfoTypes,
        open,
        multiSelect = false,
        onConfirm,
        onClose,
    } = props;
    const classes = useStyles();
    const theme = useTheme();

    const [currentPath, setCurrentPath] = useState(startingPath);
    const id = ids.SELECTION_DRAWER;
    const [viewSettings, setViewSettings] = useState({
        page: DEFAULT_PAGE_SETTINGS.page,
        rowsPerPage:
            parseInt(getLocalStorage(constants.LOCAL_STORAGE.DATA.PAGE_SIZE)) ||
            DEFAULT_PAGE_SETTINGS.rowsPerPage,
        order: DEFAULT_PAGE_SETTINGS.order,
        orderBy: DEFAULT_PAGE_SETTINGS.orderBy,
    });

    const [toolbarHeight, setToolbarRef] = useComponentHeight();

    const isInvalidSelection = (resource) => {
        return (
            getInvalidSelectionCount(
                () => [resource],
                acceptedType,
                acceptedInfoTypes,
                multiSelect
            ) > 0
        );
    };

    const handlePathChange = (path, resource) => {
        //disable file viewer from selection drawer
        if (resource?.type !== ResourceTypes.FILE) {
            setCurrentPath(path);
            setViewSettings({
                order: viewSettings?.order,
                orderBy: viewSettings?.orderBy,
                page: 0,
                rowsPerPage: viewSettings?.rowsPerPage,
            });
        }
    };

    const onRouteToListing = (path, order, orderBy, page, rowsPerPage) => {
        setViewSettings({
            order,
            orderBy,
            page,
            rowsPerPage,
        });
    };

    return (
        <Drawer
            id={id}
            onClose={onClose}
            open={open}
            anchor="right"
            PaperProps={{
                variant: "outlined",
                classes: { root: classes.selectionDrawer },
            }}
        >
            <div
                style={{
                    maxHeight: `calc(100vh - ${
                        toolbarHeight + PAGINATION_BAR_HEIGHT + theme.spacing(1)
                    }px)`,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Listing
                    path={currentPath}
                    handlePathChange={handlePathChange}
                    baseId={buildID(id, ids.DATA_VIEW)}
                    multiSelect={multiSelect}
                    isInvalidSelection={isInvalidSelection}
                    onRouteToListing={onRouteToListing}
                    page={viewSettings.page}
                    rowsPerPage={viewSettings.rowsPerPage}
                    order={viewSettings.order}
                    orderBy={viewSettings.orderBy}
                    render={(selectedTotal, getSelectedResources) => (
                        <SelectionToolbar
                            baseId={id}
                            currentPath={currentPath}
                            setCurrentPath={setCurrentPath}
                            selectedTotal={selectedTotal}
                            getSelectedResources={getSelectedResources}
                            acceptedType={acceptedType}
                            multiSelect={multiSelect}
                            onConfirm={onConfirm}
                            onClose={onClose}
                            setToolbarRef={setToolbarRef}
                            acceptedInfoTypes={acceptedInfoTypes}
                        />
                    )}
                    toolbarVisibility={false}
                    rowDotMenuVisibility={false}
                />
            </div>
        </Drawer>
    );
}

SelectionDrawer.propTypes = {
    // a path inside the storage system, e.g. /iplant/home/ipcdev
    startingPath: PropTypes.string.isRequired,
    // a function that will close the drawer
    onClose: PropTypes.func.isRequired,
    // a function that will close the drawer and accept the selected resources
    onConfirm: PropTypes.func.isRequired,
    // a bool to indicate whether the drawer is open
    open: PropTypes.bool.isRequired,
    // limits the data resource selection to that type
    acceptedType: PropTypes.oneOf(Object.values(ResourceTypes)),
    // whether multiple resources can be selected or not
    multiSelect: PropTypes.bool,
};

export default SelectionDrawer;
