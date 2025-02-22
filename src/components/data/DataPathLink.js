import { CircularProgress, Typography } from "@mui/material";
import {
    getFolderPage,
    getParentPath,
    parseNameFromPath,
} from "components/data/utils";
import { ERROR_CODES, getErrorCode } from "components/error/errorCode";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import AppParamTypes from "components/models/AppParamTypes";
import DELink from "components/utils/DELink";
import { useTranslation } from "i18n";
import Link from "next/link";
import React from "react";
import { useDataDetails } from "serviceFacades/filesystem";

export default function DataPathLink(props) {
    const { id, param_type, path } = props;

    const [statError, setStatError] = React.useState();
    const [otherError, setOtherError] = React.useState();

    React.useEffect(() => {
        if (!path) {
            setStatError(null);
            setOtherError(null);
        }
    }, [path]);

    const displayValue = parseNameFromPath(path);
    const linkTarget = getFolderPage(
        AppParamTypes.FOLDER_INPUT === param_type ? path : getParentPath(path)
    );

    const { t } = useTranslation("analyses");

    const { isFetching: isFetchingStat } = useDataDetails({
        paths: [path],
        enabled: !!path,
        onSuccess: () => {
            setStatError(null);
            setOtherError(null);
        },
        onError: (error) => {
            if (ERROR_CODES.ERR_DOES_NOT_EXIST === getErrorCode(error)) {
                setStatError(t("errorInputDoesNotExist", { path }));
                setOtherError(null);
            } else {
                setStatError(null);
                setOtherError(error);
            }
        },
    });

    return (
        <>
            <Typography component="div">
                {isFetchingStat && <CircularProgress size={16} />}
                {isFetchingStat || statError ? (
                    displayValue
                ) : (
                    <Link passHref href={linkTarget} legacyBehavior>
                        <DELink
                            id={id}
                            text={displayValue}
                            title={linkTarget}
                        />
                    </Link>
                )}
            </Typography>
            <Typography variant="caption" color="error">
                {statError}
            </Typography>
            {otherError && (
                <ErrorTypographyWithDialog
                    baseId={id}
                    errorMessage={t("errorCheckingInputStat")}
                    errorObject={otherError}
                />
            )}
        </>
    );
}
