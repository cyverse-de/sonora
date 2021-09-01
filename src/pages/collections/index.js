/**
 * @author aramsey
 *
 * A page for the collection listing view
 */

import React from "react";
import CollectionsView from "components/collections";
import { useRouter } from "next/router";
import NavigationConstants from "../../common/NavigationConstants";

export default function Collections() {
    const router = useRouter();

    const onCollectionSelected = (collectionName) => {
        router.push(
            `${NavigationConstants.COLLECTIONS}/${encodeURIComponent(
                collectionName
            )}`
        );
    };

    const onCreateCollectionSelected = () => {
        router.push(`${NavigationConstants.COLLECTIONS}/create`);
    };

    return (
        <CollectionsView
            baseId="collections"
            onCollectionSelected={onCollectionSelected}
            onCreateCollectionSelected={onCreateCollectionSelected}
        />
    );
}

Collections.getInitialProps = async () => ({
    namespacesRequired: ["collections", "common"],
});
