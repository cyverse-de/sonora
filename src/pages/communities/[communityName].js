/**
 * @author aramsey
 *
 * A page for modifying an existing community
 */

import React from "react";

import { useRouter } from "next/router";

import CommunityForm from "components/communities/form";
import NavigationConstants from "../../common/NavigationConstants";

export default function EditCommunity() {
    const router = useRouter();
    const { communityName } = router.query;

    const goBackToCommunityList = () => {
        router.push(`/${NavigationConstants.COMMUNITIES}`);
    };

    return (
        <CommunityForm
            parentId="editCommunity"
            communityName={communityName}
            goBackToCommunityList={goBackToCommunityList}
        />
    );
}

EditCommunity.getInitialProps = async () => ({
    namespacesRequired: ["communities", "common"],
});
