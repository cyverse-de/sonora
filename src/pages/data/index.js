/**
 *
 * @author sriram, aramsey
 */
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";

/**
 *
 * Handle default routing to /data
 *
 * By default, redirect to the base path for the data store
 */
export default function Data() {
    const router = useRouter();

    useEffect(() => {
        router.push(`${router.pathname}/ds`)
    }, [router])

    return (
        <Fragment/>
    );
}
