/**
 * Form field for displaying FileInput parameters.
 *
 * @author psarando
 */
import React from "react";

import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import InputSelector from "../InputSelector";

import { isReadable } from "components/data/utils";
import ResourceTypes from "components/models/ResourceTypes";
import { ERROR_CODES, getErrorCode } from "components/utils/error/errorCode";

import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "serviceFacades/filesystem";

import { CircularProgress, InputAdornment } from "@material-ui/core";

export default function FileInput({ param, ...props }) {
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
            onSuccess: (resp) => {
                const details = resp?.paths[value];
                if (!isReadable(details?.permission)) {
                    setStatError(t("errorResourceDoesNotExist"));
                } else {
                    setStatError(null);
                }
            },
            onError: (error) => {
                const errorMsg = [
                    ERROR_CODES.ERR_DOES_NOT_EXIST,
                    ERROR_CODES.ERR_NOT_READABLE,
                ].includes(getErrorCode(error))
                    ? t("errorResourceDoesNotExist")
                    : t("errorLoadingResourceStat");

                setStatError(errorMsg);
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
            acceptedType={ResourceTypes.FILE}
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
            {...inputSelectorProps}
        />
    );
}
