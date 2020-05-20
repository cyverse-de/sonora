import React, { useState } from "react";
import { injectIntl } from "react-intl";

import ids from "../ids";
import intlData from "../messages";
import ArgumentTypes from "./ArgumentTypes";
import TableLoading from "../../utils/TableLoading";
import ErrorTypography from "../../utils/error/ErrorTypography";
import DEErrorDialog from "../../utils/error/DEErrorDialog";

import { EnhancedTableHead, formatMessage, withI18N } from "@cyverse-de/ui-lib";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@material-ui/core";

function ParameterValue(props) {
    const {
        parameter: {
            info_type,
            param_type,
            param_value: { value },
        },
    } = props;
    let valid_info_type =
        !(info_type === "ReferenceGenome") &&
        !(info_type === "ReferenceSequence") &&
        !(info_type === "ReferenceAnnotation");
    let displayValue = value ? (value.display ? value.display : value) : "";

    if (
        (ArgumentTypes.PARAM_TYPE.INPUT === param_type ||
            ArgumentTypes.PARAM_TYPE.FILE_INPUT === param_type ||
            ArgumentTypes.PARAM_TYPE.FOLDER_INPUT === param_type ||
            ArgumentTypes.PARAM_TYPE.MULTIFILE_SELECTOR === param_type ||
            ArgumentTypes.PARAM_TYPE.FILE_FOLDER_INPUT === param_type) &&
        valid_info_type
    ) {
        return <span>{displayValue}</span>;
    } else {
        return <span>{displayValue}</span>;
    }
}

const columnData = [
    {
        id: ids.NAME,
        name: "Name",
        numeric: false,
        enableSorting: true,
    },
    {
        id: ids.TYPE,
        name: "Type",
        numeric: false,
        enableSorting: true,
    },
    {
        id: ids.VALUE,
        name: "Value",
        numeric: false,
        enableSorting: false,
    },
];

function AnalysisParams(props) {
    const {
        parameters,
        isParamsFetching,
        paramsFetchError,
        baseId,
        intl,
    } = props;
    const [order] = useState("desc");
    const [orderBy] = useState("Name");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    if (!parameters) {
        return null;
    }
    if (isParamsFetching) {
        return <TableLoading numColumns={3} numRows={10} />;
    }
    if (paramsFetchError) {
        return (
            <>
                <ErrorTypography
                    errorMessage={formatMessage(
                        intl,
                        "analysisParamFetchError"
                    )}
                    onDetailsClick={() => setErrorDialogOpen(true)}
                />
                <DEErrorDialog
                    open={errorDialogOpen}
                    baseId={baseId}
                    errorObject={paramsFetchError}
                    handleClose={() => {
                        setErrorDialogOpen(false);
                    }}
                />
            </>
        );
    }
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {parameters.map((n) => {
                        return (
                            <TableRow key={n.param_id}>
                                <TableCell>{n.param_name}</TableCell>
                                <TableCell>{n.param_type}</TableCell>
                                <TableCell>
                                    <ParameterValue parameter={n} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <EnhancedTableHead
                    columnData={columnData}
                    baseId="analysis"
                    order={order}
                    orderBy={orderBy}
                />
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(AnalysisParams), intlData);
