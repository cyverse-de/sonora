import React from "react";
import { useRouter } from "next/router";
import Listing from "../components/data/listing/Listing";
import Navigation from "../components/navigation/Navigation";

export default function Data() {
    const router = useRouter();
    let path = router?.query?.path;

    // Remove any trailing slashes
    if (path) {
        path = path.replace(/\/+$/, "");
    }

    const handlePathChange = (path) => router.push(`/data?path=${path}`);

    return (
        <React.Fragment>
            <Navigation navigate="data" />

            <Listing
                path={path}
                handlePathChange={handlePathChange}
                baseId="data"
            />
        </React.Fragment>
    );
}
