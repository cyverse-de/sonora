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
import { getReferenceGenomes, REFERENCE_GENOMES_QUERY_KEY } from "../../../serviceFacades/referenceGenomes";
import TableLoading from "../../utils/TableLoading";

export default function ReferenceGenomes(props) {
    const { isFetching, data, error } = useQuery(
        REFERENCE_GENOMES_QUERY_KEY,
        getReferenceGenomes
    );

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                width: 100,
                accessor: "name",
            },
            {
                Header: "Path",
                width: 350,
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
