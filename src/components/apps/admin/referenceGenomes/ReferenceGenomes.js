/**
 *
 * @author sriram
 *
 * A component intented to display list of reference genomes.
 *
 */

import React, { useEffect } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "i18n";
import { queryCache, useMutation, useQuery } from "react-query";

import NavigationConstants from "../../../../common/NavigationConstants";
import { useUserProfile } from "../../../../contexts/userProfile";
import {
    ADMIN_REFERENCE_GENOMES_QUERY_KEY,
    createReferenceGenome,
    getReferenceGenomes,
    saveReferenceGenome,
} from "../../../../serviceFacades/referenceGenomes";

import withErrorAnnouncer from "../../../utils/error/withErrorAnnouncer";
import TableLoading from "../../../utils/TableLoading";
import refGenomeConstants from "./constants";
import Edit from "./Edit";
import EnhancedTable from "./TableView";

import AnnouncerConstants from "components/utils/announcer/AnnouncerConstants";
import { announce } from "components/utils/announcer/CyVerseAnnouncer";
import { formatDateObject } from "components/utils/DateFormatter";
import dateConstants from "components/utils/dateConstants";

import {
    Dialog,
    DialogContent,
    Link,
    Typography,
    useTheme,
} from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

function ReferenceGenomes(props) {
    const { baseId, showErrorAnnouncer } = props;
    const { t } = useTranslation("referenceGenomes");
    const theme = useTheme();
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [selectedReferenceGenome, setSelectedReferenceGenome] =
        React.useState(null);

    const { isFetching, error, data } = useQuery({
        queryKey: [ADMIN_REFERENCE_GENOMES_QUERY_KEY, { deleted: true }],
        queryFn: getReferenceGenomes,
        config: {
            enabled: true,
        },
    });

    const [mutateGenome, { isFetching: genomeMutationStatus }] = useMutation(
        saveReferenceGenome,
        {
            onSuccess: (updatedGenome) => {
                setEditDialogOpen(false);
                announce({
                    text: t("updateSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.invalidateQueries(ADMIN_REFERENCE_GENOMES_QUERY_KEY);
            },
            onError: (e) => {
                showErrorAnnouncer(t("updateFailed"), e);
            },
        }
    );

    const [createGenome, { isFetching: genomeCreationStatus }] = useMutation(
        createReferenceGenome,
        {
            onSuccess: (createdGenome) => {
                setEditDialogOpen(false);
                announce({
                    text: t("createSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.invalidateQueries(ADMIN_REFERENCE_GENOMES_QUERY_KEY);
            },
            onError: (e) => {
                showErrorAnnouncer(t("createFailed"), e);
            },
        }
    );

    const dataMemo = React.useMemo(() => data?.genomes, [data]);

    const columns = React.useMemo(
        () => [
            {
                Header: t("name"),
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
                Header: t("path"),
                accessor: refGenomeConstants.keys.PATH,
            },
            {
                Header: t("createdBy"),
                accessor: refGenomeConstants.keys.CREATED_BY,
            },
            {
                Header: t("createdOn"),
                accessor: refGenomeConstants.keys.CREATED_ON,
            },
        ],
        [t, theme.palette.error.main]
    );

    useEffect(() => {
        if (selectedReferenceGenome) {
            setEditDialogOpen(true);
        }
    }, [selectedReferenceGenome]);

    useEffect(() => {
        if (error) {
            const errorString = JSON.stringify(error);
            if (router) {
                router.push(
                    `/${NavigationConstants.ERROR}?errorInfo=${errorString}`
                );
            }
        }
    }, [error, router]);

    if (isFetching || genomeMutationStatus || genomeCreationStatus) {
        return <TableLoading numColumns={5} numRows={100} baseId={baseId} />;
    }
    if (!data) {
        return <Typography> {t("noRefGenomes")} </Typography>;
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

export default withErrorAnnouncer(ReferenceGenomes);
