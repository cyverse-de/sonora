/**
 * @author aramsey
 *
 * A page for modifying an existing community
 */

import React from "react";

import { useRouter } from "next/router";

import CommunityForm from "components/communities/form";

export default function EditCommunity() {
    const router = useRouter();
    const { communityName } = router.query;

    return (
        <CommunityForm parentId="editCommunity" communityName={communityName} />
    );
}

EditCommunity.getInitialProps = async () => ({
    namespacesRequired: ["communities", "common"],
});
