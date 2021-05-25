/**
 * @author aramsey
 *
 * A drawer that allows users to view app search results and select apps
 * to be used in other areas of the app.
 *
 * Also contains its own search field to update the search term and search
 * results.
 */
import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    AppBar,
    Button,
    Drawer,
    makeStyles,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import PropTypes from "prop-types";

import AppSearchResults from "./AppSearchResults";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "./styles";

const useStyles = makeStyles(styles);

function ToolbarButtons(props) {
    const { baseId, hasSelection, hasError, onClose, onConfirm } = props;
    const { t } = useTranslation("common");
    const classes = useStyles();
    return (
        <>
            <Button
                id={build(baseId, ids.CANCEL_BTN)}
                onClick={onClose}
                variant="outlined"
                size="small"
            >
                {t("cancel")}
            </Button>

            {hasSelection && !hasError && (
                <Button
                    id={build(baseId, ids.OK_BTN)}
                    color={"primary"}
                    onClick={onConfirm}
                    variant="contained"
                    size="small"
                    classes={{ root: classes.okBtn }}
                >
                    {t("ok")}
                </Button>
            )}
        </>
    );
}

function SelectionToolbar(props) {
    const {
        baseId,
        selectedApps,
        onClose,
        onConfirm,
        validateSelection,
    } = props;
    const { t } = useTranslation("apps");
    const classes = useStyles();
    const hasSelection = selectedApps?.length > 0;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const toolbarId = build(baseId, ids.SELECTION_TOOLBAR);

    const errorMsg = validateSelection
        ? validateSelection(selectedApps)
        : false;

    const Buttons = () => (
        <ToolbarButtons
            baseId={toolbarId}
            hasSelection={hasSelection}
            hasError={!!errorMsg}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );

    return (
        <>
            <Toolbar id={toolbarId}>
                {!hasSelection ? (
                    <Typography variant="h6">{t("selectApps")}</Typography>
                ) : errorMsg ? (
                    <Typography
                        style={{ color: theme.palette.error.main }}
                        variant="h6"
                    >
                        {errorMsg}
                    </Typography>
                ) : (
                    <Typography color="primary" variant="h6">
                        {t("selectedItems", { count: selectedApps?.length })}
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
        </>
    );
}

function SearchToolbar(props) {
    const { baseId, currentSearch, setCurrentSearch } = props;
    const classes = useStyles();

    const [searchText, setSearchText] = useState(currentSearch);
    const handleInputChange = (event) => setSearchText(event.target.value);

    useEffect(() => {
        let timeOutId = null;
        if (searchText && searchText.length > 2) {
            timeOutId = setTimeout(() => setCurrentSearch(searchText), 500);
        }
        return () => clearTimeout(timeOutId);
    }, [searchText, setCurrentSearch]);

    return (
        <AppBar position="relative">
            <Toolbar>
                <TextField
                    fullWidth
                    variant="standard"
                    id={build(baseId, ids.SEARCH)}
                    value={searchText}
                    onChange={handleInputChange}
                    className={classes.searchField}
                    InputProps={{
                        startAdornment: <SearchIcon color="primary" />,
                        disableUnderline: true,
                    }}
                />
            </Toolbar>
        </AppBar>
    );
}

function AppSearchDrawer(props) {
    const { open, onConfirm, onClose, searchTerm, validateSelection } = props;
    const classes = useStyles();
    const [currentSearch, setCurrentSearch] = useState(searchTerm);
    const [selectedApps, setSelectedApps] = useState([]);

    useEffect(() => {
        setCurrentSearch(searchTerm);
    }, [searchTerm]);

    const baseId = ids.APP_SEARCH_DRAWER;

    const handleConfirm = () => onConfirm(selectedApps);

    return (
        <Drawer
            id={baseId}
            onClose={onClose}
            open={open}
            anchor="right"
            PaperProps={{
                variant: "outlined",
                classes: { root: classes.selectionDrawer },
            }}
        >
            <SearchToolbar
                baseId={baseId}
                currentSearch={currentSearch}
                setCurrentSearch={setCurrentSearch}
            />

            <SelectionToolbar
                baseId={baseId}
                onClose={onClose}
                onConfirm={handleConfirm}
                validateSelection={validateSelection}
                selectedApps={selectedApps}
            />

            <AppSearchResults
                searchTerm={currentSearch}
                baseId={baseId}
                selectable={true}
                setSelectedApps={setSelectedApps}
            />
        </Drawer>
    );
}

export default AppSearchDrawer;

AppSearchDrawer.propTypes = {
    /**
     * validateSelection is an optional function prop to check if the
     * current selected apps meet a condition.  If the selection is invalid,
     * it should return a string with an error message, otherwise return falsy
     */
    validateSelection: PropTypes.func,
    open: PropTypes.bool.isRequired, // whether the drawer is open or not
    onConfirm: PropTypes.func.isRequired, // when apps are selected
    onClose: PropTypes.func.isRequired, // when the drawer is closed
    searchTerm: PropTypes.string.isRequired, // the app search term
};
