/**
 * @author aramsey
 *
 * A page for creating a new community
 */

import React from "react";

import { useRouter } from "next/router";

import CommunityForm from "components/communities/form";
import NavigationConstants from "common/NavigationConstants";

export default function CreateCommunity() {
    const router = useRouter();

    const goBackToCommunityList = () => {
        router.push(`/${NavigationConstants.COMMUNITIES}`);
    };

    return (
        <CommunityForm
            parentId="createCommunity"
            goBackToCommunityList={goBackToCommunityList}
        />
    );
}

CreateCommunity.getInitialProps = async () => ({
    namespacesRequired: ["communities", "common"],
});
