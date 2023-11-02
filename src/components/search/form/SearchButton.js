/**
 * @author aramsey
 *
 * A button for bringing up the advanced data search form in a dialog
 */

import React, { useState } from "react";

import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import buildID from "components/utils/DebugIDUtil";
import ids from "./ids";
import { useTranslation } from "i18n";
import SearchForm from "./index";

function SearchButton(props) {
    const { parentId } = props;
    const { t } = useTranslation("search");

    const [open, setOpen] = useState(false);

    const onClickSearchBtn = () => {
        setOpen(true);
    };

    const onCloseSearch = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                id={buildID(parentId, ids.ADVANCED_SEARCH_BTN)}
                onClick={onClickSearchBtn}
                variant="outlined"
                color="primary"
                startIcon={<SearchIcon />}
            >
                {t("advancedSearch")}
            </Button>
            <SearchForm open={open} onClose={onCloseSearch} />
        </>
    );
}

export default SearchButton;
