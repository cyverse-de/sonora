/**
 *
 * @author sriram
 */
import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import constants from "../../../constants";
import NavigationConstants from "../../../components/layout/NavigationConstants";

/**
 *
 * Handle default routing to /data/ds
 *
 */
export default function Data() {
    const router = useRouter();
    const handlePathChange = (path) => {
        //return "ds" from /data/ds/[...pathItems]
        const storageId = router.pathname.split(constants.PATH_SEPARATOR)[2];
        router.push(
            constants.PATH_SEPARATOR +
                NavigationConstants.DATA +
                constants.PATH_SEPARATOR +
                `${storageId}${path}`
        );
    };
    return (
        <Listing path="" handlePathChange={handlePathChange} baseId="data" />
    );
}
