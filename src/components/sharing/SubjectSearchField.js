import React, { useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    CircularProgress,
    TextField,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useQuery } from "react-query";

import ids from "./ids";
import { searchSubjects } from "serviceFacades/sharing";
import isQueryLoading from "../utils/isQueryLoading";
import { useTranslation } from "i18n";
import { isGroup } from "components/sharing/util";

function SubjectSearchField(props) {
    const { baseId, onUserSelected, onSearchStart } = props;
    const { t } = useTranslation("sharing");
    const [searchTerm, setSearchTerm] = useState(null);
    const [options, setOptions] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { status: subjectSearchStatus } = useQuery({
        queryKey: { searchTerm },
        queryFn: searchSubjects,
        config: {
            enabled: searchTerm && searchTerm.length > 2,
            onSuccess: (resp) => {
                setOptions(resp.subjects);
            },
        },
    });

    const onUserAdded = () => {
        setSearchTerm(null);
    };

    const onInputChange = (event) => {
        if (event) {
            const newSearchTerm = event.target.value;
            setSearchTerm(newSearchTerm);
            newSearchTerm && onSearchStart();
        }
    };

    const getGroupName = (group) => {
        return group.name.split(":").pop();
    };

    const loading = isQueryLoading(subjectSearchStatus);

    return (
        <Autocomplete
            id={baseId}
            freeSolo
            value={searchTerm}
            onChange={(event, user) =>
                user && onUserSelected(user, onUserAdded)
            }
            onInputChange={onInputChange}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => {
                if (typeof option === "string") {
                    return option;
                }
                // Show only exact matches - either exact match
                // by email or user ID - or groups
                return searchTerm === option.email
                    ? option.email
                    : searchTerm === option.id
                    ? option.id
                    : isGroup(option)
                    ? getGroupName(option)
                    : "";
            }}
            filterOptions={(options, params) => {
                return options.filter(
                    (option) =>
                        searchTerm === option.email ||
                        searchTerm === option.id ||
                        isGroup(option)
                );
            }}
            loading={loading}
            options={options}
            noOptionsText={t("noUsersFound")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={isMobile ? t("searchUsersMobile") : t("searchUsers")}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress
                                        id={build(baseId, ids.LOADING_SKELETON)}
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

export default SubjectSearchField;
