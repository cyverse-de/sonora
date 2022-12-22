/**
 *
 * @author sboleyn
 *
 * A page to access the admin subscription interface.
 *
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";
import Listing from "../../components/subscriptions/listing/Listing";

import NavigationConstants from "common/NavigationConstants";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

export default function Subscriptions() {
    const router = useRouter();
    const query = router.query;
    const searchTerm = query.searchTerm || "";

    const profile = useUserProfile()[0];
    const isAdmin = profile?.admin;

    const onRouteToListing = useCallback(
        (searchTerm) => {
            router.push({
                pathname: `/${NavigationConstants.ADMIN}/${NavigationConstants.SUBSCRIPTIONS}`,
                query: {
                    searchTerm: searchTerm,
                },
            });
        },
        [router]
    );
    if (!isAdmin) {
        return <NotAuthorized />;
    } else {
        return (
            <>
                <Listing
                    baseId="subscription"
                    isAdminView={isAdmin}
                    onRouteToListing={onRouteToListing}
                    searchTerm={searchTerm}
                />
            </>
        );
    }
}

Subscriptions.getInitialProps = async () => ({
    namespacesRequired: ["subscriptions"],
});
