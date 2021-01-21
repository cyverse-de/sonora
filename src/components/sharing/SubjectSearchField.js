import React, { useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    CircularProgress,
    TextField,
    useMediaQuery,
    useTheme,
    Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useQuery } from "react-query";

import ids from "./ids";
import { searchSubjects } from "serviceFacades/sharing";
import isQueryLoading from "../utils/isQueryLoading";
import { useTranslation } from "i18n";
import { isGroup, groupName } from "components/sharing/util";
import PersonIcon from "@material-ui/icons/Person";
import { TeamIcon } from "../teams/Icons";

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
            //clear existing results on new search
            setOptions([]);
        }
    };

    const renderCustomOption = (option) => {
        let optionLabel = null;
        let icon = null;
        if (isGroup(option)) {
            optionLabel = groupName(option);
            icon = (
                <TeamIcon
                    fontSize="small"
                    style={{ color: theme.palette.info.main }}
                />
            );
        } else {
            if (searchTerm === option.email) {
                optionLabel = option.email;
            } else if (searchTerm === option.id) {
                optionLabel = option.id;
            }
            icon = (
                <PersonIcon
                    fontSize="small"
                    style={{ color: theme.palette.info.main }}
                />
            );
        }
        return (
            <>
                <span style={{ marginRight: theme.spacing(0.5) }}>{icon}</span>
                <div
                    style={{
                        flexGrow: 1,
                        margin: theme.spacing(1),
                    }}
                >
                    <Typography
                        variant={"subtitle2"}
                        color={theme.palette.info.primary}
                    >
                        {optionLabel}
                    </Typography>
                </div>
            </>
        );
    };

    const loading = isQueryLoading(subjectSearchStatus);

    return (
        <Autocomplete
            id={baseId}
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
                return isGroup(option)
                    ? groupName(option)
                    : option["display_name"];
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
            popupIcon={null}
            clearOnBlur={true}
            renderOption={(option, state) => renderCustomOption(option)}
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
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

export default SubjectSearchField;
