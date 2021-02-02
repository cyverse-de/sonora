import React from "react";
import { useTranslation } from "i18n";
import ids from "./ids";
import appType from "components/models/AppType";
import { build } from "@cyverse-de/ui-lib";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

function getFilters() {
    return Object.values(appType);
}

export default function AppsTypeFilter(props) {
    const { baseId, filter, handleFilterChange, classes, disabled } = props;
    const { t } = useTranslation("apps");

    return (
        <Autocomplete
            id={build(baseId, ids.APPS_FILTER)}
            disabled={disabled}
            value={filter}
            options={getFilters()}
            size="small"
            onChange={(event, newValue) => {
                handleFilterChange(newValue);
            }}
            getOptionLabel={(option) => option.display}
            getOptionSelected={(option, value) => option.value === value.value}
            className={classes.filter}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t("filterLbl")}
                    variant="outlined"
                />
            )}
        />
    );
}
export { getFilters };
