import React from "react";
import { mockAxios } from "../axiosMock";
import {
    collectionAdmins,
    collectionAdminsInfo,
    collectionApps,
    collectionFollowers,
    devCollection,
    myCollectionList,
    updateCollectionNameDescMock,
} from "./CollectionMocks";
import CollectionView from "components/collections";
import CollectionsForm from "components/collections/form";
import { appsSearchResp } from "../search/searchMocks";

export const View = () => {
    mockAxios.onGet("/api/communities").reply(200, myCollectionList);
    return <CollectionView baseId="collections" />;
};

export const ViewCollection = () => {
    const collectionName = "Dev Collection";

    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(collectionName)}/admins`)
        .reply(200, collectionAdmins(false));
    mockAxios
        .onGet("/api/user-info?username=batman&username=alfred")
        .reply(200, collectionAdminsInfo(false));
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(collectionName)}`)
        .reply(200, devCollection);
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(collectionName)}/members`)
        .reply(200, collectionFollowers);
    mockAxios
        .onGet(
            `/api/apps/communities/${encodeURIComponent(collectionName)}/apps`
        )
        .reply(200, collectionApps);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);

    return <CollectionsForm parentId="form" collectionName={collectionName} />;
};

export const EditCollection = () => {
    const collectionName = "Another Collection";

    const logRequest = (req) => {
        const { method, url, params, data } = req;
        console.log("REQUEST:", method, url, params, data);
    };

    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(collectionName)}/admins`)
        .reply(200, collectionAdmins(true));
    mockAxios
        .onGet("/api/user-info?username=batman&username=alfred&username=ipcdev")
        .reply(200, collectionAdminsInfo(true));
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(collectionName)}`)
        .reply(200, devCollection);
    mockAxios
        .onGet(`/api/communities/${encodeURIComponent(collectionName)}/members`)
        .reply(200, collectionFollowers);
    mockAxios
        .onGet(
            `/api/apps/communities/${encodeURIComponent(collectionName)}/apps`
        )
        .reply(200, collectionApps);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);

    mockAxios
        .onPatch(`/api/communities/${encodeURIComponent(collectionName)}`)
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
        .onPatch(`/api/communities/${encodeURIComponent(collectionName)}`)
        .reply((req) => {
            logRequest(req);
            return [200, updateCollectionNameDescMock];
        });

    mockAxios
        .onPost(
            `/api/communities/${encodeURIComponent(
                collectionName
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
                collectionName
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
                    reason: "Failed to remove an app from the collection, try again",
                },
            ];
        })
        .onDelete(/\/api\/apps\/.*\/communities/)
        .reply((req) => {
            logRequest(req);
            return [200];
        });

    return <CollectionsForm parentId="form" collectionName={collectionName} />;
};

export default {
    title: "Collections",
};
