/**
 * @author aramsey
 *
 * A page for viewing the vice loading page
 */

import React from "react";

import { useRouter } from "next/router";
import ViceLoading from "components/vice/loading";

export default function Loading() {
    const router = useRouter();
    const { accessUrl } = router.query;

    return <ViceLoading accessUrl={accessUrl} />;
}

Loading.getInitialProps = async () => ({
    namespacesRequired: ["vice-loading", "common"],
});
