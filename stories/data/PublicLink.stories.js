import React from "react";
import PublicLinks from "../../src/components/data/PublicLinks";
import { mockAxios } from "../axiosMock";
export default {
    title: "Data / Public Links",
};

const successResp = {
    user: "sriram",
    paths: {
        "/iplant/home/sriram/RNA8_S8_R-th3142.bam":
            "https://data.cyverse.org/dav-anon/iplant/home/sriram/RNA8_S8_R-th3142.bam",
        "/iplant/home/sriram/RNA8_S8_R-th3142.bam.bai":
            "https://data.cyverse.org/dav-anon/iplant/home/sriram/RNA8_S8_R-th3142.bam.bai",
    },
};

export const PublicLinksTest = () => {
    mockAxios.onPost(/\/api\/filesystem\/anon-files.*/).reply(200, successResp);
    return (
        <PublicLinks
            paths={[
                "/iplant/home/sriram/RNA8_S8_R-th3142.bam",
                "/iplant/home/sriram/RNA8_S8_R-th3142.bam.bai",
            ]}
        />
    );
};
