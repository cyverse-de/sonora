/**
 * @author sriram, psarando
 *
 * A panel that displays analysis params.
 *
 *
 */

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import DETableHead from "components/table/DETableHead";
import TableLoading from "components/table/TableLoading";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import React, { useState } from "react";
import ids from "../ids";
import { isInputType, isReferenceGenomeType } from "./ArgumentTypeUtils";
import DataPathLink from "../../data/DataPathLink";

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
            <DataPathLink
                id={buildID(baseId, param_id)}
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
