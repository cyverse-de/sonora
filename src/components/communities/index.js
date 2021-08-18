/**
 * @author aramsey
 *
 * The entire view that displays when navigating to /communities
 */

import React, { useState } from "react";

import Listing from "./Listing";
import Toolbar from "./Toolbar";

const COMMUNITY_FILTER = {
    MY_COMMUNITIES: "MY_COMMUNITIES",
    ALL_COMMUNITIES: "ALL_COMMUNITIES",
};

function Communities(props) {
    const { baseId, onCommunitySelected, onCreateCommunitySelected } = props;
    const [communityFilter, setCommunityFilter] = useState(
        COMMUNITY_FILTER.ALL_COMMUNITIES
    );

    return (
        <>
            <Toolbar
                parentId={baseId}
                filter={communityFilter}
                setFilter={setCommunityFilter}
                onCreateCommunitySelected={onCreateCommunitySelected}
            />
            <Listing
                parentId={baseId}
                filter={communityFilter}
                onCommunitySelected={onCommunitySelected}
            />
        </>
    );
}

export default Communities;
export { COMMUNITY_FILTER };
