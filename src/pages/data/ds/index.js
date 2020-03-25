/**
 *
 * @author sriram
 */
import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import { getRoutingPath } from "../index";

/**
 *
 * Handle default routing to /data/ds
 *
 */
export default function Data() {
    const router = useRouter();
    const handlePathChange = (path) => {
        router.push(getRoutingPath(router.pathname, path));
    };
    return (
        <Listing path="" handlePathChange={handlePathChange} baseId="data" />
    );
}
