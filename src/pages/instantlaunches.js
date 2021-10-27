/**
 * @author aramsey
 *
 * Instant launch listing page
 */
import React from "react";

import Listing from "components/instantlaunches/listing";

export default function InstantLaunches() {
    return <Listing baseId="instantLaunches" />;
}

InstantLaunches.getInitialProps = async () => ({
    namespacesRequired: ["instantlaunches"],
});
