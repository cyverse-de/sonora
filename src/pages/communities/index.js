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
        router.push(
            `${NavigationConstants.COMMUNITIES}/${encodeURIComponent(
                communityName
            )}`
        );
    };

    const onCreateCommunitySelected = () => {
        router.push(
            `${NavigationConstants.COMMUNITIES}/create`
        );
    }

    return (
        <CommunitiesView
            baseId="communities"
            onCommunitySelected={onCommunitySelected}
            onCreateCommunitySelected={onCreateCommunitySelected}
        />
    );
}

Communities.getInitialProps = async () => ({
    namespacesRequired: ["communities", "common"],
});
