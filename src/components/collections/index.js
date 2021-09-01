/**
 * @author aramsey
 *
 * The entire view that displays when navigating to /collections
 */

import React, { useState } from "react";

import Listing from "./Listing";
import Toolbar from "./Toolbar";

const COLLECTION_FILTER = {
    MY_COLLECTIONS: "MY_COLLECTIONS",
    ALL_COLLECTIONS: "ALL_COLLECTIONS",
};

function Collections(props) {
    const { baseId, onCollectionSelected, onCreateCollectionSelected } = props;
    const [collectionFilter, setCollectionFilter] = useState(
        COLLECTION_FILTER.ALL_COLLECTIONS
    );

    return (
        <>
            <Toolbar
                parentId={baseId}
                filter={collectionFilter}
                setFilter={setCollectionFilter}
                onCreateCollectionSelected={onCreateCollectionSelected}
            />
            <Listing
                parentId={baseId}
                filter={collectionFilter}
                onCollectionSelected={onCollectionSelected}
            />
        </>
    );
}

export default Collections;
export { COLLECTION_FILTER };
