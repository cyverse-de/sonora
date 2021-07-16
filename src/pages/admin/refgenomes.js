import React from "react";
import ReferenceGenomes from "../../components/apps/admin/referenceGenomes/ReferenceGenomes";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

export default function RefGenome() {
    const profile = useUserProfile()[0];
    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        return <ReferenceGenomes baseId="adminReferenceGenomes" />;
    }
}

RefGenome.getInitialProps = async () => ({
    namespacesRequired: ["referenceGenomes"],
});
