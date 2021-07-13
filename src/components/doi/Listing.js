/**
 * @author sriram
 *
 * A component intended to list all the DOI requests in a table view.
 *
 */
import React, { useState, useEffect } from "react";
import { useQuery, queryCache, useMutation } from "react-query";
import { useTranslation } from "i18n";

import { AnnouncerConstants, announce } from "@cyverse-de/ui-lib";

import ids from "./ids";
import TableView from "./TableView";
import DOIToolbar from "./Toolbar";
import globalConstants from "../../constants";
import UpdateRequestDialog from "../utils/UpdateRequestDialog";
import RequestType from "components/models/RequestType";

import DEPagination from "components/utils/DEPagination";
import {
    adminGetDOIRequests,
    adminCreateDOI,
    DOI_LISTING_QUERY_KEY,
} from "serviceFacades/doi";
import { INFO_TYPES_QUERY_KEY, getInfoTypes } from "serviceFacades/filesystem";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import DetailsDrawer from "components/data/details/Drawer";
import ResourceTypes from "components/models/ResourceTypes";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

function Listing(props) {
    const {
        baseId,
        order,
        orderBy,
        page,
        rowsPerPage,
        onRouteToListing,
        showErrorAnnouncer,
        onRouteToMetadataView,
    } = props;
    const { t: dataI18n } = useTranslation("data");
    const { t } = useTranslation("doi");
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState();
    const [updateDialogOpen, setUpdateDialogOpen] = useState();
    const [selectedFolder, setSelectedFolder] = useState();
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [confirmDOIOpen, setConfirmDOIOpen] = useState(false);

    const { isFetching, error } = useQuery({
        queryKey: [
            DOI_LISTING_QUERY_KEY,
            { order, orderBy, page, rowsPerPage },
        ],
        queryFn: adminGetDOIRequests,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === globalConstants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                isAsc
                    ? globalConstants.SORT_DESCENDING
                    : globalConstants.SORT_ASCENDING,
                property,
                page,
                rowsPerPage
            );
    };

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                showErrorAnnouncer(dataI18n("infoTypeFetchError"), e);
            },
        },
    });

    const [createDOI, { isLoading: createDOILoading }] = useMutation(
        adminCreateDOI,
        {
            onSuccess: () => {
                announce({
                    text: t("createDoiSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.invalidateQueries(DOI_LISTING_QUERY_KEY);
            },
            onError: (error) => {
                showErrorAnnouncer(t("createDoiError"), error);
            },
        }
    );

    const handleClick = (event, id, index) => {
        setSelected(id);
    };

    const handleChangePage = (event, newPage) => {
        onRouteToListing &&
            onRouteToListing(order, orderBy, newPage - 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToListing &&
            onRouteToListing(order, orderBy, 0, parseInt(newPageSize, 10));
    };

    const getSelectedRequest = (id) => {
        const item = id ? id : selected;
        return data?.requests?.find((req) => req.id === item);
    };

    const handlePathClick = (id) => {
        const selFolder = getSelectedRequest(id)?.folder;
        if (selFolder) {
            //add missing type information manually.
            setSelectedFolder({ ...selFolder, type: ResourceTypes.FOLDER });
        }
    };

    const onViewMetaData = (id) => {
        const selFolder = getSelectedRequest(id)?.folder;
        onRouteToMetadataView(selFolder?.path);
    };

    return (
        <>
            <DOIToolbar
                baseId={baseId}
                selected={selected}
                onUpdateClick={() => setUpdateDialogOpen(true)}
                onMetadataClick={onViewMetaData}
                onCreateDOIClick={() => setConfirmDOIOpen(true)}
            />
            <TableView
                baseId={baseId}
                listing={data}
                error={error}
                loading={isFetching || createDOILoading}
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
                handleClick={handleClick}
                selected={selected}
                handleUserNameClick={() => setUpdateDialogOpen(true)}
                handlePathClick={handlePathClick}
            />
            {data && data?.total > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(data?.total / rowsPerPage)}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
            <UpdateRequestDialog
                requestType={RequestType.DOI}
                open={updateDialogOpen}
                onClose={() => setUpdateDialogOpen(false)}
                requestId={selected}
            />
            {selectedFolder && (
                <DetailsDrawer
                    resource={selectedFolder}
                    onClose={() => setSelectedFolder(null)}
                    baseId={baseId}
                    open={selectedFolder !== null}
                    infoTypes={infoTypes}
                />
            )}
            <ConfirmationDialog
                open={confirmDOIOpen}
                title={t("createDoi")}
                contentText={t("createDoiPrompt")}
                onClose={() => setConfirmDOIOpen(false)}
                onConfirm={() => {
                    setConfirmDOIOpen(false);
                    createDOI(selected);
                }}
                confirmButtonText={t("createDoi")}
                baseId={ids.DOI_CONFIRM_DIALOG}
            />
        </>
    );
}
export default withErrorAnnouncer(Listing);
