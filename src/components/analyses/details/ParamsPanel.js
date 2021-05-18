/**
 * @author sriram, psarando
 *
 * A panel that displays analysis params.
 *
 *
 */

import React, { useState } from "react";

import Link from "next/link";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import ids from "../ids";
import { isInputType, isReferenceGenomeType } from "./ArgumentTypeUtils";

import {
    getFolderPage,
    getParentPath,
    parseNameFromPath,
} from "components/data/utils";
import AppParamTypes from "components/models/AppParamTypes";

import DELink from "components/utils/DELink";
import DETableHead from "components/utils/DETableHead";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import { ERROR_CODES, getErrorCode } from "components/utils/error/errorCode";
import TableLoading from "components/utils/TableLoading";

import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "serviceFacades/filesystem";

import { build as buildId } from "@cyverse-de/ui-lib";

import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";

function InputParameterValue(props) {
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

    const { isFetching: isFetchingStat } = useQuery({
        queryKey: [DATA_DETAILS_QUERY_KEY, { paths: [path] }],
        queryFn: getResourceDetails,
        config: {
            enabled: path,
            onSuccess: () => {
                setStatError(null);
                setOtherError(null);
            },
            onError: (error) => {
                if (ERROR_CODES.ERR_DOES_NOT_EXIST === getErrorCode(error)) {
                    setStatError(
                        t("errorInputDoesNotExist", { path: linkTarget })
                    );
                    setOtherError(null);
                } else {
                    setStatError(null);
                    setOtherError(error);
                }
            },
        },
    });

    return (
        <>
            <Typography component="div">
                {isFetchingStat && <CircularProgress size={16} />}
                {isFetchingStat || statError ? (
                    displayValue
                ) : (
                    <Link passHref href={linkTarget}>
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

function ParameterValue(props) {
    const {
        baseId,
        parameter: {
            param_id,
            param_type,
            param_value: { value },
        },
    } = props;

    let valid_info_type = !isReferenceGenomeType(param_type);
    let displayValue = value ? (value.display ? value.display : value) : "";

    if (isInputType(param_type) && valid_info_type) {
        return (
            <InputParameterValue
                id={buildId(baseId, param_id)}
                param_type={param_type}
                path={displayValue}
            />
        );
    } else {
        return <Typography>{displayValue}</Typography>;
    }
}

const columnData = (t) => [
    {
        id: ids.NAME,
        name: t("name"),
        numeric: false,
        enableSorting: true,
    },
    {
        id: ids.TYPE,
        name: t("paramType"),
        numeric: false,
        enableSorting: true,
    },
    {
        id: ids.VALUE,
        name: t("value"),
        numeric: false,
        enableSorting: false,
    },
];

function AnalysisParams(props) {
    const { parameters, isParamsFetching, paramsFetchError, baseId } = props;
    const { t } = useTranslation("analyses");
    const [order] = useState("desc");
    const [orderBy] = useState("Name");

    let columns = columnData(t);

    if (isParamsFetching) {
        return <TableLoading numColumns={3} numRows={10} />;
    }

    if (!parameters && !isParamsFetching && !paramsFetchError) {
        return null;
    }

    if (paramsFetchError) {
        return (
            <ErrorTypographyWithDialog
                baseId={baseId}
                errorMessage={t("analysisParamFetchError")}
                errorObject={paramsFetchError}
            />
        );
    }
    return (
        <TableContainer>
            <Table size="small" stickyHeader={true}>
                <TableBody>
                    {parameters.map((param, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <Typography>{param.param_name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{param.param_type}</Typography>
                                </TableCell>
                                <TableCell>
                                    <ParameterValue
                                        baseId={baseId}
                                        parameter={param}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <DETableHead
                    columnData={columns}
                    baseId={baseId}
                    order={order}
                    orderBy={orderBy}
                />
            </Table>
        </TableContainer>
    );
}

export default AnalysisParams;
