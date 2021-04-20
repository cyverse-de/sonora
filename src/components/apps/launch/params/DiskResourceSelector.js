/**
 * Form field for displaying FileInput parameters.
 *
 * @author psarando
 */
import React from "react";

import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import InputSelector from "../InputSelector";

import { ERROR_CODES, getErrorCode } from "components/utils/error/errorCode";

import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "serviceFacades/filesystem";

import { CircularProgress, InputAdornment } from "@material-ui/core";

export default function DiskResourceSelector({ param, ...props }) {
    const {
        field: { value },
    } = props;

    const [statError, setStatError] = React.useState();

    React.useEffect(() => {
        if (!value) {
            setStatError(null);
        }
    }, [value]);

    const { t } = useTranslation("launch");

    const { isFetching: isFetchingStat } = useQuery({
        queryKey: [DATA_DETAILS_QUERY_KEY, { paths: [value] }],
        queryFn: getResourceDetails,
        config: {
            enabled: value,
            onSuccess: () => {
                setStatError(null);
            },
            onError: (error) => {
                if (ERROR_CODES.ERR_DOES_NOT_EXIST === getErrorCode(error)) {
                    setStatError(t("errorResourceDoesNotExist"));
                } else {
                    setStatError(null);
                }
            },
        },
    });

    const inputSelectorProps = {};

    if (statError) {
        inputSelectorProps.error = true;
        inputSelectorProps.helperText = statError;
    }

    if (isFetchingStat) {
        inputSelectorProps.InputProps = {
            readOnly: true,
            endAdornment: (
                <InputAdornment position="end">
                    <CircularProgress color="inherit" size={20} />
                </InputAdornment>
            ),
        };
    }

    return (
        <InputSelector
            margin="normal"
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
            {...inputSelectorProps}
        />
    );
}
