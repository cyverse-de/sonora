/**
 * @author aramsey
 *
 * A Drawer component used for enabling the user to pick data
 * resources as input to other components.
 */

import React, { useEffect, useState } from "react";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    Button,
    Drawer,
    IconButton,
    InputAdornment,
    makeStyles,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Directions } from "@material-ui/icons";
import PropTypes from "prop-types";

import ids from "./ids";
import Listing from "./listing/Listing";
import messages from "./messages";
import ResourceTypes from "../models/ResourceTypes";

import styles from "./styles";

import PageWrapper from "../../components/layout/PageWrapper";
import useComponentHeight from "../utils/useComponentHeight";

const useStyles = makeStyles(styles);

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
    } = props;
    const classes = useStyles();
    const [displayPath, setDisplayPath] = useState("");

    useEffect(() => {
        setDisplayPath(currentPath);
    }, [currentPath]);

    const selectedResources = getSelectedResources();

    // Only return the paths to each resource, not the full resource object
    // The path key includes the file name if it's a file
    const handleConfirm = () => {
        if (multiSelect) {
            const resourceNames = selectedResources.map(
                (resource) => resource.path
            );
            onConfirm(resourceNames);
        } else {
            onConfirm(selectedResources[0].path);
        }
    };

    const invalidTotal =
        ResourceTypes.ANY !== acceptedType
            ? selectedResources.filter(
                  (resource) => resource.type.toLowerCase() !== acceptedType
              ).length
            : 0;

    const hasValidSelection = Boolean(selectedTotal && !invalidTotal);
    const hasInvalidSelection = selectedTotal && invalidTotal;

    return (
        <>
            <Toolbar id={build(baseId, ids.SELECTION_TOOLBAR)}>
                <Typography>
                    {hasValidSelection
                        ? getMessage("selectedItems", {
                              values: { total: selectedTotal },
                          })
                        : hasInvalidSelection
                        ? getMessage("invalidSelection", {
                              values: {
                                  type: acceptedType,
                                  total: invalidTotal,
                              },
                          })
                        : getMessage("selectionSuggestion", {
                              values: {
                                  type: acceptedType,
                                  multiSelect,
                              },
                          })}
                </Typography>
                <div className={classes.divider} />
                <Button
                    id={build(baseId, ids.SELECTION_TOOLBAR, ids.CANCEL_BTN)}
                    onClick={onClose}
                >
                    {getMessage("cancel")}
                </Button>
                {hasValidSelection && (
                    <Button
                        id={build(baseId, ids.SELECTION_TOOLBAR, ids.OK_BTN)}
                        color={"primary"}
                        onClick={handleConfirm}
                    >
                        {getMessage("ok")}
                    </Button>
                )}
            </Toolbar>
            <Toolbar>
                <TextField
                    id={build(baseId, ids.DATA_PATH)}
                    label={getMessage("path")}
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
                                    id={build(
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
        open,
        multiSelect = false,
        onConfirm,
        onClose,
    } = props;
    const classes = useStyles();

    const [currentPath, setCurrentPath] = useState(startingPath);
    const id = ids.SELECTION_DRAWER;

    const isInvalidSelection = (resource) => {
        return ResourceTypes.ANY !== acceptedType
            ? resource.type.toLowerCase() !== acceptedType
            : false;
    };

    const [appBarHeight] = useComponentHeight();

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
            <PageWrapper appBarHeight={150}>
                <Listing
                    path={currentPath}
                    handlePathChange={setCurrentPath}
                    baseId={build(id, ids.DATA_VIEW)}
                    multiSelect={multiSelect}
                    isInvalidSelection={isInvalidSelection}
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
                        />
                    )}
                />
            </PageWrapper>
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

export default withI18N(SelectionDrawer, messages);
