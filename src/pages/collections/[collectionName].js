/**
 * @author aramsey
 *
 * A page for modifying an existing collection
 */

import React from "react";

import { useRouter } from "next/router";

import CollectionForm from "components/collections/form";
import NavigationConstants from "common/NavigationConstants";

export default function EditCollection() {
    const router = useRouter();
    const { collectionName } = router.query;

    const goBackToCollectionList = () => {
        router.push(`/${NavigationConstants.COLLECTIONS}`);
    };

    return (
        <CollectionForm
            parentId="editCollection"
            collectionName={collectionName}
            goBackToCollectionList={goBackToCollectionList}
        />
    );
}

EditCollection.getInitialProps = async () => ({
    namespacesRequired: ["collections", "common"],
});
