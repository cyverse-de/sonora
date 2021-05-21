/**
 * @author sriram, aramsey, psarando
 *
 */
import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import constants from "../../../constants";
import { NavigationParams } from "common/NavigationConstants";

import { getLocalStorage } from "components/utils/localStorage";
import viewerConstants from "components/data/viewers/constants";
import Listing from "components/data/listing/Listing";
import { getEncodedPath, DEFAULT_PAGE_SETTINGS } from "components/data/utils";
import infoTypes from "components/models/InfoTypes";
import ResourceTypes from "components/models/ResourceTypes";

import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "serviceFacades/filesystem";

const FileViewer = dynamic(() => import("components/data/viewers/FileViewer"));
const MetadataForm = dynamic(() => import("components/metadata/form"));

/**
 * This variable value needs to match the name of this file for the routing to work
 * properly without doing a hard refresh.
 *
 * See https://nextjs.org/docs/api-reference/next/router#usage and
 * https://nextjs.org/docs/api-reference/next/link#dynamic-routes
 * @type {string}
 */
const dynamicPathName = "/[...pathItems]";

/**
 *
 * Handle routing to /data/ds/pathInDataStore
 *
 */
export default function DataStore() {
    const router = useRouter();
    const query = router.query;

    const selectedPage =
        parseInt(query.selectedPage) || DEFAULT_PAGE_SETTINGS.page;
    const selectedRowsPerPage =
        parseInt(query.selectedRowsPerPage) ||
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.DATA.PAGE_SIZE)) ||
        DEFAULT_PAGE_SETTINGS.rowsPerPage;
    const selectedOrder = query.selectedOrder || DEFAULT_PAGE_SETTINGS.order;
    const selectedOrderBy =
        query.selectedOrderBy || DEFAULT_PAGE_SETTINGS.orderBy;

    const isFile = query.type === ResourceTypes.FILE;
    const resourceId = query.resourceId;
    const createFileType = query.createFileType;
    const viewMetadata = query.view === NavigationParams.VIEW.METADATA;

    const routerPathname = router.pathname;
    const fullPath = router.asPath;
    // Remove the dynamic part of the path if it's there
    // (it won't be there if user navigates directly to /data/ds)
    const baseRoutingPath = routerPathname.replace(dynamicPathName, "");
    const path = fullPath.replace(baseRoutingPath, "").split("?")[0];
    const resourcePath = decodeURIComponent(path);

    const handlePathChange = useCallback(
        (path, query) => {
            const pathname = `${baseRoutingPath}${getEncodedPath(path)}`;

            router.push({
                pathname,
                query,
            });
        },
        [baseRoutingPath, router]
    );

    const onCreateFileSelected = useCallback(
        (path) => {
            const encodedPath = getEncodedPath(
                path.concat(`/${viewerConstants.NEW_FILE_NAME}`)
            );

            router.push({
                pathname: `${baseRoutingPath}${encodedPath}`,
                query: {
                    type: ResourceTypes.FILE,
                    createFileType: infoTypes.RAW,
                },
            });
        },
        [baseRoutingPath, router]
    );

    const onCreateHTFileSelected = useCallback(
        (path) => {
            const encodedPath = getEncodedPath(
                path.concat(`/${viewerConstants.NEW_FILE_NAME}`)
            );

            router.push({
                pathname: `${baseRoutingPath}${encodedPath}`,
                query: {
                    type: ResourceTypes.FILE,
                    createFileType: infoTypes.HT_ANALYSIS_PATH_LIST,
                },
            });
        },
        [baseRoutingPath, router]
    );

    const onCreateMultiInputFileSelected = useCallback(
        (path) => {
            const encodedPath = getEncodedPath(
                path.concat(`/${viewerConstants.NEW_FILE_NAME}`)
            );

            router.push({
                pathname: `${baseRoutingPath}${encodedPath}`,
                query: {
                    type: ResourceTypes.FILE,
                    createFileType: infoTypes.MULTI_INPUT_PATH_LIST,
                },
            });
        },
        [baseRoutingPath, router]
    );

    const onNewFileSaved = useCallback(
        (path, resourceId) => {
            const encodedPath = getEncodedPath(path);

            // Using router.replace instead of push to prevent the user
            // from navigating back to a create-file page.
            router.replace({
                pathname: `${baseRoutingPath}${encodedPath}`,
                query: {
                    type: ResourceTypes.FILE,
                    resourceId,
                },
            });
        },
        [baseRoutingPath, router]
    );

    const onRouteToListing = useCallback(
        (path, order, orderBy, page, rowsPerPage) => {
            if (path) {
                const encodedPath = getEncodedPath(path);

                router.push({
                    pathname: `${baseRoutingPath}${encodedPath}`,
                    query: {
                        selectedOrder: order,
                        selectedOrderBy: orderBy,
                        selectedPage: page,
                        selectedRowsPerPage: rowsPerPage,
                    },
                });
            }
        },
        [baseRoutingPath, router]
    );

    const [details, setDetails] = useState(null);
    const [errorObject, setErrorObject] = useState(null);

    const { isFetching: detailsLoading } = useQuery({
        queryKey: [DATA_DETAILS_QUERY_KEY, { paths: [resourcePath] }],
        queryFn: getResourceDetails,
        config: {
            enabled: viewMetadata,
            onSuccess: (resp) => {
                setDetails(resp?.paths[resourcePath]);
            },
            onError: setErrorObject,
        },
    });

    if (viewMetadata) {
        return (
            <MetadataForm
                loading={detailsLoading}
                loadingError={errorObject}
                targetResource={details}
            />
        );
    }

    if (isFile) {
        return (
            <FileViewer
                resourceId={resourceId}
                path={resourcePath}
                createFileType={createFileType}
                baseId="data.viewer"
                handlePathChange={handlePathChange}
                onNewFileSaved={onNewFileSaved}
            />
        );
    }

    return (
        <Listing
            path={resourcePath}
            handlePathChange={handlePathChange}
            baseId="data"
            onCreateFileSelected={onCreateFileSelected}
            onCreateHTFileSelected={onCreateHTFileSelected}
            onCreateMultiInputFileSelected={onCreateMultiInputFileSelected}
            page={selectedPage}
            rowsPerPage={selectedRowsPerPage}
            order={selectedOrder}
            orderBy={selectedOrderBy}
            onRouteToListing={onRouteToListing}
        />
    );
}

DataStore.getInitialProps = async () => ({
    namespacesRequired: ["data", "util"],
});
