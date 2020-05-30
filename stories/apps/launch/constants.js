import { mockAxios } from "../../axiosMock";

import {
    fileTypesResp,
    pagedDirectoryResp,
    dataRootsResp,
} from "../../data/DataMocks";

export const initMockAxiosFileFolderSelector = () => {
    mockAxios
        .onGet(/\/api\/filesystem\/paged-directory.*/)
        .reply(200, pagedDirectoryResp);
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResp);
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);
};

export const ANALYSIS_OUTPUT_DIR = "/iplant/home/aramsey/analyses_qa";
export const STARTING_PATH = "/iplant/home/aramsey";

export const submitAnalysis = (submission, onSuccess, onError) => {
    setTimeout(() => {
        console.log(submission);
        onSuccess("success!");
    }, 1000);
};

export const saveQuickLaunch = submitAnalysis;
