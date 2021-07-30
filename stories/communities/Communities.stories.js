import React from "react";
import { mockAxios } from "../axiosMock";
import {
    communityAdmins,
    communityAdminsInfo,
    communityApps,
    communityFollowers,
    devCommunity,
    myCommunityList,
} from "./CommunityMocks";
import CommunityView from "components/communities";
import CommunitiesForm from "components/communities/form";
import { appsSearchResp } from "../search/searchMocks";

export const View = () => {
    mockAxios.onGet("/api/communities").reply(200, myCommunityList);
    return <CommunityView baseId="communities" />;
};

export const ViewCommunity = () => {
    const communityName = "ipcdev:Dev Team";

    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(communityName)}/admins`)
        .reply(200, communityAdmins(false));
    mockAxios
        .onGet("/api/user-info?username=batman&username=alfred")
        .reply(200, communityAdminsInfo(false));
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(communityName)}`)
        .reply(200, devCommunity);
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(communityName)}/members`)
        .reply(200, communityFollowers);
    mockAxios
        .onGet(
            `/api/apps/communities/${encodeURIComponent(communityName)}/apps`
        )
        .reply(200, communityApps);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);

    return <CommunitiesForm parentId="form" communityName={communityName} />;
};

export const EditCommunity = () => {
    const communityName = "ipcdev:Another Team";

    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(communityName)}/admins`)
        .reply(200, communityAdmins(true));
    mockAxios
        .onGet("/api/user-info?username=batman&username=alfred&username=ipcdev")
        .reply(200, communityAdminsInfo(true));
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(communityName)}`)
        .reply(200, devCommunity);
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(communityName)}/members`)
        .reply(200, communityFollowers);
    mockAxios
        .onGet(
            `/api/apps/communities/${encodeURIComponent(communityName)}/apps`
        )
        .reply(200, communityApps);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);

    return <CommunitiesForm parentId="form" communityName={communityName} />;
};

export default {
    title: "Communities",
};
