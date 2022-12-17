/**
 *
 * @author sboleyn
 *
 * A page to access the admin subscription interface.
 *
 */

import React from "react";
// import { useQueryClient } from "react-query";
// import { useUserProfile } from "contexts/userProfile";
import Listing from "../components/subscriptions/listing/Listing";

export default function Subscriptions() {
    // Get QueryClient from the context
    // const queryClient = useQueryClient();

    // const [userProfile] = useUserProfile();

    // admin: true, id: "sboleyn", ...
    // console.log(userProfile)

    return (
        <>
            <Listing />
        </>
    );
}

Subscriptions.getInitialProps = async () => ({
    namespacesRequired: ["subscriptions", "common", "util"],
});
