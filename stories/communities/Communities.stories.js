import React from "react";
import { mockAxios } from "../axiosMock";
import {
    communityAdmins,
    communityAdminsInfo,
    communityApps,
    communityFollowers,
    devCommunity,
    myCommunityList,
    updateCommunityNameDescMock,
} from "./CommunityMocks";
import CommunityView from "components/communities";
import CommunitiesForm from "components/communities/form";
import { appsSearchResp } from "../search/searchMocks";

export const View = () => {
    mockAxios.onGet("/api/communities").reply(200, myCommunityList);
    return <CommunityView baseId="communities" />;
};

export const ViewCommunity = () => {
    const communityName = "Dev Community";

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
    const communityName = "Another Community";

    const logRequest = (req) => {
        const { method, url, params, data } = req;
        console.log("REQUEST:", method, url, params, data);
    };

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

    mockAxios
        .onPatch(`/api/communities/${encodeURIComponent(communityName)}`)
        .replyOnce((req) => {
            logRequest(req);
            return [
                500,
                {
                    error_code: 500,
                    reason: "Failed to update name/desc, try again",
                },
            ];
        })
        .onPatch(`/api/communities/${encodeURIComponent(communityName)}`)
        .reply((req) => {
            logRequest(req);
            return [200, updateCommunityNameDescMock];
        });

    mockAxios
        .onPost(
            `/api/communities/${encodeURIComponent(
                communityName
            )}/admins/deleter`
        )
        .replyOnce((req) => {
            logRequest(req);
            return [
                500,
                {
                    error_code: 500,
                    reason: "Failed to remove an admin, try again",
                },
            ];
        })
        .onPost(
            `/api/communities/${encodeURIComponent(
                communityName
            )}/admins/deleter`
        )
        .reply((req) => {
            logRequest(req);
            return [200];
        });

    mockAxios
        .onDelete(/\/api\/apps\/.*\/communities/)
        .replyOnce((req) => {
            logRequest(req);
            return [
                500,
                {
                    error_code: 500,
                    reason: "Failed to remove an app from the community, try again",
                },
            ];
        })
        .onDelete(/\/api\/apps\/.*\/communities/)
        .reply((req) => {
            logRequest(req);
            return [200];
        });

    return <CommunitiesForm parentId="form" communityName={communityName} />;
};

export default {
    title: "Communities",
};
