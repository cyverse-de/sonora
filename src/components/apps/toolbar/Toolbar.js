import React from "react";

import ids from "../ids";
import messages from "../messages";
import { injectIntl } from "react-intl";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    Button,
    Hidden,
    IconButton,
    TextField,
    Toolbar,
} from "@material-ui/core";
import DisplayTypeSelector from "../../utils/DisplayTypeSelector";
import AppNavigation, { getAppTypeFilters } from "./AppNavigation";
import Autocomplete from "@material-ui/lab/Autocomplete";
import appType from "../../models/AppType";
import { Info, MoreVert as MoreVertIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

/**
 *
 * A toolbar with menu and navigation actions for apps
 *
 * @param props
 * @constructor
 */

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    filter: {
        [theme.breakpoints.down("xs")]: {
            width: 130,
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            width: 150,
            margin: theme.spacing(1),
        },
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

function AppsToolbar(props) {
    const {
        handleCategoryChange,
        handleFilterChange,
        handleAppNavError,
        setCategoryStatus,
        filter,
        selectedCategory,
        isGridView,
        toggleDisplay,
        detailsEnabled,
        onDetailsSelected,
        intl,
        baseId,
    } = props;

    const classes = useStyles();
    const appsToolbarId = build(baseId, ids.APPS_TOOLBAR);

    return (
        <Toolbar variant="dense">
            <Hidden smDown>
                <DisplayTypeSelector
                    baseId={appsToolbarId}
                    toggleDisplay={toggleDisplay}
                    isGridView={isGridView}
                />
            </Hidden>
            <AppNavigation
                baseId={appsToolbarId}
                handleCategoryChange={handleCategoryChange}
                setCategoryStatus={setCategoryStatus}
                selectedCategory={selectedCategory}
                handleAppNavError={handleAppNavError}
            />
            <Autocomplete
                id={build(appsToolbarId, ids.APPS_FILTER)}
                disabled={
                    selectedCategory?.system_id?.toLowerCase() ===
                    appType.agave.toLowerCase()
                }
                value={filter}
                options={getAppTypeFilters()}
                size="small"
                onChange={(event, newValue) => {
                    handleFilterChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                className={classes.filter}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={formatMessage(intl, "filterLbl")}
                        variant="outlined"
                    />
                )}
            />
            <div className={classes.divider} />
            <Hidden smDown>
                {detailsEnabled && (
                    <Button
                        id={build(appsToolbarId, ids.DETAILS_BTN)}
                        className={classes.toolbarItems}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={onDetailsSelected}
                        startIcon={<Info />}
                    >
                        {getMessage("details")}
                    </Button>
                )}
            </Hidden>
            <IconButton className={classes.toolbarItems}>
                <MoreVertIcon />
            </IconButton>
        </Toolbar>
    );
}

export default withI18N(injectIntl(AppsToolbar), messages);
