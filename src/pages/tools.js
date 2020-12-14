import React from "react";
import Listing from "../components/tools/listing/Listing";

export default function Tools() {
    return <Listing baseId="tools" />;
}

Tools.getInitialProps = async () => ({
    namespacesRequired: ["tools", "common", "util"],
});
