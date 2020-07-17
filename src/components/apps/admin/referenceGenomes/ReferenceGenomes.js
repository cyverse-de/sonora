/**
 *
 * @author sriram
 *
 * A component intented to display list of reference genomes.
 *
 */

import React, { useEffect } from "react";
import { useQuery, useMutation, queryCache } from "react-query";

import EnhancedTable from "./TableView";
import Edit from "./Edit";

import {
    getAdminReferenceGenomes,
    saveReferenceGenome,
    ADMIN_REFERENCE_GENOMES_QUERY_KEY,
} from "../../../../serviceFacades/referenceGenomes";
import TableLoading from "../../../utils/TableLoading";
import withErrorAnnouncer from "../../../utils/error/withErrorAnnouncer";

import { announce, AnnouncerConstants } from "@cyverse-de/ui-lib";

import { Link, useTheme, Dialog, DialogContent } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

function ReferenceGenomes(props) {
    const { showErrorAnnouncer } = props;
    const theme = useTheme();
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [
        selectedReferenceGenome,
        setSelectedReferenceGenome,
    ] = React.useState(null);

    const { isFetching, data, error } = useQuery(
        ADMIN_REFERENCE_GENOMES_QUERY_KEY,
        getAdminReferenceGenomes
    );

    const [mutateGenome, { status: genomeMutationStatus }] = useMutation(
        saveReferenceGenome,
        {
            onSuccess: (updatedGenome) => {
                announce({
                    text: "Genome updated successfully.",
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.setQueryData(
                    ADMIN_REFERENCE_GENOMES_QUERY_KEY,
                    (data) => {
                        if (data?.genomes && updatedGenome) {
                            return {
                                genomes: [...data.genomes, updatedGenome],
                            };
                        } else {
                            return data;
                        }
                    }
                );
            },
            onError: (e) => {
                showErrorAnnouncer(
                    "Unabled to save reference genome. Please try again!",
                    e
                );
            },
        }
    );
    const dataMemo = React.useMemo(() => data?.genomes, [data]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ row, value }) => (
                    <>
                        {row?.original?.deleted && (
                            <RemoveCircleIcon
                                style={{ color: theme.palette.error.main }}
                            />
                        )}
                        <Link
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedReferenceGenome(row.original);
                            }}
                        >
                            {value}
                        </Link>
                    </>
                ),
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
        [theme.palette.error.main]
    );

    useEffect(() => {
        if (selectedReferenceGenome) {
            setEditDialogOpen(true);
        }
    }, [selectedReferenceGenome]);

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

    return (
        <>
            <EnhancedTable
                columns={columns}
                data={dataMemo}
                onAddClicked={() => setEditDialogOpen(true)}
            />
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
            >
                <DialogContent>
                    <Edit
                        values={selectedReferenceGenome}
                        onCancel={() => setEditDialogOpen(false)}
                        saveRefGenome={mutateGenome}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default withErrorAnnouncer(ReferenceGenomes);
