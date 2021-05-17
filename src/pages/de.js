/**
 * A backwards compatibility page for redirecting legacy links
 * to their proper current locations.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";

import {
    getAppLaunchPath,
    getListingPath,
    getQuickLaunchPath,
} from "components/apps/utils";
import { getFolderPage } from "components/data/utils";
import systemId from "components/models/systemId";
import BasicTable from "components/utils/BasicTable";

export default function DeLegacyRedirector() {
    const router = useRouter();
    const query = router.query;

    let redirectPath;
    switch (query?.type) {
        case "apps":
            if (query["app-category"]) {
                redirectPath = getListingPath(
                    null,
                    null,
                    null,
                    null,
                    null,
                    JSON.stringify({
                        system_id: query["system-id"] || systemId.de,
                        id: query["app-category"],
                    })
                );
            } else {
                redirectPath = getAppLaunchPath(
                    query["system-id"],
                    query["app-id"]
                );
            }

            break;

        case "data":
            redirectPath = getFolderPage(query.folder);
            break;

        case "quick-launch":
            redirectPath = getQuickLaunchPath(
                query["system-id"] || systemId.de,
                query["app-id"],
                query["quick-launch-id"]
            );
            break;

        default:
            redirectPath = "/";
            break;
    }

    // router can only be used client-side.
    React.useEffect(() => {
        router.replace(redirectPath);
    }, [router, redirectPath]);

    return (
        <BasicTable
            baseId="legacy-de-redirect-placeholder"
            loading
            tableSize="medium"
            columns={[{ id: 1 }, { id: 2 }, { id: 3 }]}
            data={[]}
        />
    );
}
