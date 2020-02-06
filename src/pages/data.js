import React from "react";

import { useRouter } from "next/router";
import Listing from "../components/data/listing/Listing";

export default function Data() {
    const router = useRouter();
    let path = router?.query?.path;

    // Remove any trailing slashes
    if (path) {
        path = path.replace(/\/+$/, "");
    }

    const handlePathChange = (path) => router.push(`/data?path=${path}`);

    return <Listing path={path} handlePathChange={handlePathChange} />;
}
