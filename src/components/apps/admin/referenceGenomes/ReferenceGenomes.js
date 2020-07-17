/**
 *
 * @author sriram
 *
 * A component intented to display list of reference genomes.
 *
 */

import React from "react";
import { useQuery } from "react-query";

import EnhancedTable from "./EnhancedTable";
import {
    getAdminReferenceGenomes,
    ADMIN_REFERENCE_GENOMES_QUERY_KEY,
} from "../../../../serviceFacades/referenceGenomes";
import TableLoading from "../../../utils/TableLoading";
import { Link, useTheme } from "@material-ui/core";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default function ReferenceGenomes(props) {
    const theme = useTheme();
    const { isFetching, data, error } = useQuery(
        ADMIN_REFERENCE_GENOMES_QUERY_KEY,
        getAdminReferenceGenomes
    );

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ row, value }) => {
                    if (row?.original?.deleted) {
                        return <><RemoveCircleIcon style={{color:theme.palette.error.main }}/> <Link>{value} </Link></>;
                    } else {
                        return <Link> {value}</Link>;
                    }
                },
            },
            {
                Header: "Path",
                accessor: "path",
            },
            {
                Header: "Created By",
                accessor: "created_by",
            },
            {
                Header: "Created On",
                accessor: "created_on",
            },
        ],
        []
    );

    if (isFetching) {
        return (
            <TableLoading
                numColumns={5}
                numRows={100}
                baseId="adminRefGenomes"
            />
        );
    }

    if (error) {
        console.log("Error when fetching ref genomes");
        return null;
    }

    return <EnhancedTable columns={columns} data={data?.genomes} />;
}
