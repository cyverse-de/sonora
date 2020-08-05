/**
 *
 * @author sriram, aramsey
 */
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";

import constants from "../../constants";

/**
 *
 * Handle default routing to /data
 *
 * By default, redirect to the base path for the data store
 */
export default function Data() {
    const router = useRouter();

    useEffect(() => {
        router.push(
            `${router.pathname}${constants.PATH_SEPARATOR}${constants.DATA_STORE_STORAGE_ID}`
        );
    }, [router]);

    return <Fragment />;
}

Data.getInitialProps = async () => ({
    namespacesRequired: ["data"],
});
