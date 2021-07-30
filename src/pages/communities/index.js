/**
 * @author aramsey
 *
 * A page for the community listing view
 */

import React from "react";
import CommunitiesView from "components/communities";
import { useRouter } from "next/router";
import NavigationConstants from "../../common/NavigationConstants";

export default function Communities() {
    const router = useRouter();

    const onCommunitySelected = (communityName) => {
        console.log(communityName);
        router.push(
            `${NavigationConstants.COMMUNITIES}/${encodeURIComponent(
                communityName
            )}`
        );
    };

    return (
        <CommunitiesView
            baseId="communities"
            onCommunitySelected={onCommunitySelected}
        />
    );
}

Communities.getInitialProps = async () => ({
    namespacesRequired: ["communities", "common"],
});
