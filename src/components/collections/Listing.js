/**
 * @author aramsey
 *
 * A component that displays either the list of all collections or only
 * collections they are currently following
 */

import React, { useMemo, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import { useQuery } from "react-query";

import BasicTable from "components/table/BasicTable";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import isQueryLoading from "components/utils/isQueryLoading";
import { useUserProfile } from "contexts/userProfile";
import { useTranslation } from "i18n";
import ids from "./ids";
import { COLLECTION_FILTER } from "./index";
import {
    ALL_COLLECTIONS_QUERY,
    getAllCollections,
    getMyCollections,
    MY_COLLECTIONS_QUERY,
} from "serviceFacades/groups";
import DELink from "../utils/DELink";

function Columns(t) {
    return {
        NAME: { fieldName: t("name"), key: "display_extension" },
        DESCRIPTION: { fieldName: t("description"), key: "description" },
    };
}

function Listing(props) {
    const { parentId, filter, onCollectionSelected } = props;

    const { t } = useTranslation(["collections", "search"]);
    const [data, setData] = useState([]);
    const [userProfile] = useUserProfile();

    const tableId = buildID(parentId, ids.TABLE);
    const COLLECTION_COLUMNS = Columns(t);

    const columns = useMemo(() => {
        return [
            {
                Header: COLLECTION_COLUMNS.NAME.fieldName,
                accessor: COLLECTION_COLUMNS.NAME.key,
                Cell: ({ row, value }) => {
                    const collection = row.original;
                    const rowId = buildID(tableId, collection.id);
                    return (
                        <DELink
                            id={buildID(rowId, ids.COLLECTION_LINK)}
                            onClick={() =>
                                onCollectionSelected(collection.name)
                            }
                            text={value}
                        />
                    );
                },
            },
            {
                Header: COLLECTION_COLUMNS.DESCRIPTION.fieldName,
                accessor: COLLECTION_COLUMNS.DESCRIPTION.key,
            },
        ];
    }, [COLLECTION_COLUMNS, onCollectionSelected, tableId]);

    const { isFetching: fetchMyCollections, error: myCollectionsError } =
        useQuery({
            queryKey: [MY_COLLECTIONS_QUERY, { userId: userProfile?.id }],
            enabled: userProfile?.id,
            queryFn: getMyCollections,
            config: {
                enabled: COLLECTION_FILTER.MY_COLLECTIONS === filter,
                onSuccess: (results) => {
                    setData(results.groups);
                },
            },
        });

    const { isFetching: fetchAllCollections, error: allCollectionsError } =
        useQuery({
            queryKey: [ALL_COLLECTIONS_QUERY],
            queryFn: getAllCollections,
            config: {
                enabled: COLLECTION_FILTER.ALL_COLLECTIONS === filter,
                onSuccess: (results) => {
                    setData(results.groups);
                },
            },
        });

    const loading = isQueryLoading([fetchMyCollections, fetchAllCollections]);

    const error = allCollectionsError || myCollectionsError;

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={parentId} />;
    }

    return (
        <BasicTable
            baseId={tableId}
            columns={columns}
            data={data}
            loading={loading}
            emptyDataMessage={t("noCollections")}
            sortable
        />
    );
}

export default Listing;
