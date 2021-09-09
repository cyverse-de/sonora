import React from "react";

import DownloadLinksDialog from "components/bags/downloads";

export default {
    title: "Bags / Downloads",
};

const data = ["/test/path/one", "/test/path/two", "/test/path/three"];

export const TestDownloadLinksDialog = () => {
    return <DownloadLinksDialog paths={data} onClose={() => {}} open={true} />;
};
