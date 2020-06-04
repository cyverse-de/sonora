/**
 * @author sriram
 *
 * A panel that displays analysis params.
 *
 *
 */

import React, { useState } from "react";
import { injectIntl } from "react-intl";

import { parseNameFromPath } from "../../data/utils";
import DEErrorDialog from "../../utils/error/DEErrorDialog";
import ErrorTypography from "../../utils/error/ErrorTypography";
import TableLoading from "../../utils/TableLoading";
import ids from "../ids";
import intlData from "../messages";
import { isInputType, isReferenceGenomeType } from "./ArgumentTypeUtils";

import { EnhancedTableHead, formatMessage, withI18N } from "@cyverse-de/ui-lib";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";

function ParameterValue(props) {
    const {
        parameter: {
            param_type,
            param_value: { value },
        },
    } = props;

    let valid_info_type = !isReferenceGenomeType(param_type);
    let displayValue = value ? (value.display ? value.display : value) : "";

    if (isInputType(param_type) && valid_info_type) {
        return <Typography>{parseNameFromPath(displayValue)}</Typography>;
    } else {
        return <Typography>{displayValue}</Typography>;
    }
}

const columnData = (intl) => [
    {
        id: ids.NAME,
        name: formatMessage(intl, "name"),
        numeric: false,
        enableSorting: true,
    },
    {
        id: ids.TYPE,
        name: formatMessage(intl, "paramType"),
        numeric: false,
        enableSorting: true,
    },
    {
        id: ids.VALUE,
        name: formatMessage(intl, "value"),
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
    let columns = columnData(intl);

    if (isParamsFetching) {
        return <TableLoading numColumns={3} numRows={10} />;
    }

    if (!parameters && !isParamsFetching && !paramsFetchError) {
        return null;
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
                                    <ParameterValue parameter={param} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <EnhancedTableHead
                    columnData={columns}
                    baseId={baseId}
                    order={order}
                    orderBy={orderBy}
                />
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(AnalysisParams), intlData);
