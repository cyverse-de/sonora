/**
 * @author aramsey
 *
 * A component that displays either the list of all communities or only
 * communities they are currently following
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
import { COMMUNITY_FILTER } from "./index";
import {
    ALL_COMMUNITIES_QUERY,
    getAllCommunities,
    getMyCommunities,
    MY_COMMUNITIES_QUERY,
} from "serviceFacades/groups";
import DELink from "../utils/DELink";

function Columns(t) {
    return {
        NAME: { fieldName: t("name"), key: "display_extension" },
        DESCRIPTION: { fieldName: t("description"), key: "description" },
    };
}

function Listing(props) {
    const { parentId, filter, onCommunitySelected } = props;

    const { t } = useTranslation(["communities", "search"]);
    const [data, setData] = useState([]);
    const [userProfile] = useUserProfile();

    const tableId = buildID(parentId, ids.TABLE);
    const COMMUNITY_COLUMNS = Columns(t);

    const columns = useMemo(() => {
        return [
            {
                Header: COMMUNITY_COLUMNS.NAME.fieldName,
                accessor: COMMUNITY_COLUMNS.NAME.key,
                Cell: ({ row, value }) => {
                    const community = row.original;
                    const rowId = buildID(tableId, community.id);
                    return (
                        <DELink
                            id={buildID(rowId, ids.COMMUNITY_LINK)}
                            onClick={() => onCommunitySelected(community.name)}
                            text={value}
                        />
                    );
                },
            },
            {
                Header: COMMUNITY_COLUMNS.DESCRIPTION.fieldName,
                accessor: COMMUNITY_COLUMNS.DESCRIPTION.key,
            },
        ];
    }, [COMMUNITY_COLUMNS, onCommunitySelected, tableId]);

    const { isFetching: fetchMyCommunities, error: myCommunitiesError } =
        useQuery({
            queryKey: [MY_COMMUNITIES_QUERY, { userId: userProfile?.id }],
            enabled: !!userProfile?.id,
            queryFn: () => getMyCommunities({ userId: userProfile?.id }),
            onSuccess: (results) => {
                setData(results.groups);
            },
        });

    const { isFetching: fetchAllCommunities, error: allCommunitiesError } =
        useQuery({
            queryKey: [ALL_COMMUNITIES_QUERY],
            queryFn: getAllCommunities,
            enabled: COMMUNITY_FILTER.ALL_COMMUNITIES === filter,
            onSuccess: (results) => {
                setData(results.groups);
            },
        });

    const loading = isQueryLoading([fetchMyCommunities, fetchAllCommunities]);

    const error = allCommunitiesError || myCommunitiesError;

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={parentId} />;
    }

    return (
        <BasicTable
            baseId={tableId}
            columns={columns}
            data={data}
            loading={loading}
            emptyDataMessage={t("noCommunities")}
            sortable
        />
    );
}

export default Listing;
