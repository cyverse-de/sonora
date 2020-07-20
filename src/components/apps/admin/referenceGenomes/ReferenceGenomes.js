/**
 *
 * @author sriram
 *
 * A component intented to display list of reference genomes.
 *
 */

import React, { useEffect } from "react";

import { useQuery, useMutation, queryCache } from "react-query";
import { injectIntl } from "react-intl";
import { useRouter } from "next/router";

import refGenomeConstants from "./constants";
import messages from "./messages";
import EnhancedTable from "./TableView";
import Edit from "./Edit";

import {
    getAdminReferenceGenomes,
    createReferenceGenome,
    saveReferenceGenome,
    ADMIN_REFERENCE_GENOMES_QUERY_KEY,
} from "../../../../serviceFacades/referenceGenomes";

import TableLoading from "../../../utils/TableLoading";
import withErrorAnnouncer from "../../../utils/error/withErrorAnnouncer";
import { useUserProfile } from "../../../../contexts/userProfile";
import NavigationConstants from "../../../../common/NavigationConstants";

import {
    announce,
    AnnouncerConstants,
    formatDateObject,
    dateConstants,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import { Link, useTheme, Dialog, DialogContent } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

function ReferenceGenomes(props) {
    const { baseId, intl, showErrorAnnouncer } = props;
    const theme = useTheme();
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [
        selectedReferenceGenome,
        setSelectedReferenceGenome,
    ] = React.useState(null);
    const [error, setError] = React.useState(null);

    const { isFetching, data } = useQuery({
        queryKey: ADMIN_REFERENCE_GENOMES_QUERY_KEY,
        queryFn: getAdminReferenceGenomes,
        config: {
            onError: (e) => {
                setError(e);
            },
        },
    });

    const [mutateGenome, { isFetching: genomeMutationStatus }] = useMutation(
        saveReferenceGenome,
        {
            onSuccess: (updatedGenome) => {
                setEditDialogOpen(false);
                announce({
                    text: formatMessage(intl, "updateSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.invalidateQueries(ADMIN_REFERENCE_GENOMES_QUERY_KEY);
            },
            onError: (e) => {
                showErrorAnnouncer(formatMessage(intl, "updateFailed"), e);
            },
        }
    );

    const [createGenome, { isFetching: genomeCreationStatus }] = useMutation(
        createReferenceGenome,
        {
            onSuccess: (createdGenome) => {
                setEditDialogOpen(false);
                announce({
                    text: formatMessage(intl, "createSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.invalidateQueries(ADMIN_REFERENCE_GENOMES_QUERY_KEY);
            },
            onError: (e) => {
                showErrorAnnouncer(formatMessage(intl, "createFailed"), e);
            },
        }
    );

    const dataMemo = React.useMemo(() => data?.genomes, [data]);

    const columns = React.useMemo(
        () => [
            {
                Header: formatMessage(intl, "name"),
                accessor: refGenomeConstants.keys.NAME,
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
                Header: formatMessage(intl, "path"),
                accessor: refGenomeConstants.keys.PATH,
            },
            {
                Header: formatMessage(intl, "createdBy"),
                accessor: refGenomeConstants.keys.CREATED_BY,
            },
            {
                Header: formatMessage(intl, "createdOn"),
                accessor: refGenomeConstants.keys.CREATED_ON,
            },
        ],
        [intl, theme.palette.error.main]
    );

    useEffect(() => {
        if (selectedReferenceGenome) {
            setEditDialogOpen(true);
        }
    }, [selectedReferenceGenome]);

    useEffect(() => {
        if (error) {
            const errorString = JSON.stringify(error);
            setError(null);
            router.push(
                `/${NavigationConstants.ERROR}?errorInfo=` + errorString
            );
        }
    }, [error, router]);

    if (isFetching || genomeMutationStatus || genomeCreationStatus) {
        return <TableLoading numColumns={5} numRows={100} baseId={baseId} />;
    }

    return (
        <>
            <EnhancedTable
                columns={columns}
                data={dataMemo}
                baseId={baseId}
                onAddClicked={() => {
                    const user = userProfile?.id;
                    const currentDate = formatDateObject(
                        new Date(),
                        dateConstants.LONG_DATE_FORMAT
                    );
                    setSelectedReferenceGenome({
                        created_by: user,
                        created_on: currentDate,
                        last_modified_on: currentDate,
                        last_modified_by: user,
                    });
                    setEditDialogOpen(true);
                }}
            />
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
            >
                <DialogContent>
                    <Edit
                        baseId={baseId}
                        referenceGenome={selectedReferenceGenome}
                        onCancel={() => setEditDialogOpen(false)}
                        saveRefGenome={mutateGenome}
                        createRefGenome={createGenome}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default withI18N(
    injectIntl(withErrorAnnouncer(ReferenceGenomes)),
    messages
);
