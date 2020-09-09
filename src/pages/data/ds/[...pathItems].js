/**
 * @author sriram, aramsey
 *
 */

import React from "react";
import { useRouter } from "next/router";
import Listing from "components/data/listing/Listing";
import { getEncodedPath } from "components/data/utils";
import ResourceTypes from "components/models/ResourceTypes";
import FileViewer from "components/data/viewers/FileViewer";

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
    const isFile = query.file;
    const routerPathname = router.pathname;
    const fullPath = router.asPath;
    // Remove the dynamic part of the path if it's there
    // (it won't be there if user navigates directly to /data/ds)
    const baseRoutingPath = routerPathname.replace(dynamicPathName, "");
    const path = fullPath
        .replace(baseRoutingPath, "")
        .replace("?file=true", "");

    const handlePathChange = (path, resourceType) => {
        const encodedPath = getEncodedPath(path);
        if (!resourceType || resourceType === ResourceTypes.FOLDER) {
            router.push(
                `${baseRoutingPath}${dynamicPathName}`,
                `${baseRoutingPath}${encodedPath}`
            );
        } else {
            router.push(
                `${baseRoutingPath}${dynamicPathName}?file=true`,
                `${baseRoutingPath}${encodedPath}?file=true`
            );
        }
    };
    if (!isFile) {
        return (
            <Listing
                path={decodeURIComponent(path)}
                handlePathChange={handlePathChange}
                baseId="data"
            />
        );
    } else {
        return (
            <FileViewer path={decodeURIComponent(path)} baseId="data.viewer" />
        );
    }
}

DataStore.getInitialProps = async () => ({
    namespacesRequired: ["data"],
});
