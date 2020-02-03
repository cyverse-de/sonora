import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import Listing from "../components/data/listing/Listing";

function PathLink(props) {
    const { path, children } = props;
    return <Link href={`/data?path=${path}`}>{children}</Link>;
}

export default function Data() {
    const router = useRouter();
    let path = router?.query?.path;

    // Remove any trailing slashes
    if (path) {
        path = path.replace(/\/+$/, "");
    }

    return <Listing path={path} PathLink={PathLink} />;
}
