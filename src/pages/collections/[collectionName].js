/**
 * @author aramsey
 *
 * A page for modifying an existing collection
 */

import React from "react";

import { useRouter } from "next/router";

import { serverSideTranslations, RequiredNamespaces } from "i18n";

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

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "collections",
                ...RequiredNamespaces,
            ])),
        },
    };
}
