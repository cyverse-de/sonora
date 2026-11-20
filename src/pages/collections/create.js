/**
 * @author aramsey
 *
 * A page for creating a new collection
 */

import React from "react";

import { useRouter } from "next/router";
import { commonServerSideProps } from "common/getServerSideProps";

import { i18n } from "i18n";
import CollectionForm from "components/collections/form";
import NavigationConstants from "common/NavigationConstants";

export default function CreateCollection() {
    const router = useRouter();

    const goBackToCollectionList = () => {
        router.push(`/${NavigationConstants.COLLECTIONS}`);
    };

    return (
        <CollectionForm
            parentId="createCollection"
            goBackToCollectionList={goBackToCollectionList}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("collections:featureName");

    return {
        props: {
            title,
            ...(await commonServerSideProps(locale, ["collections"])),
        },
    };
}
