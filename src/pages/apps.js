import React from "react";

import { useRouter } from "next/router";

import { getAppLaunchPath } from "../components/apps/utils";
import Listing from "../components/apps/listing/Listing";

export default function Apps() {
    const router = useRouter();

    return (
        <Listing
            baseId="apps"
            onRouteToApp={(systemId, appId) =>
                router.push(getAppLaunchPath(systemId, appId))
            }
        />
    );
}
