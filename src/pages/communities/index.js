/**
 * @author aramsey
 *
 * A page for the community listing view
 */

import React from "react";
import CommunitiesView from "components/communities";

export default function Communities() {
    return <CommunitiesView baseId="communities" />;
}

Communities.getInitialProps = async () => ({
    namespacesRequired: ["communities", "common"],
});
