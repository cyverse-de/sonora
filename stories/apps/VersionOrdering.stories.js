import React from "react";

import ids from "components/apps/editor/ids";
import VersionsOrderingForm from "components/apps/editor/VersionsOrderingForm";

export default { title: "Apps / Editor" };

export const VersionsOrdering = () => {
    return (
        <VersionsOrderingForm
            baseId={ids.APP_VERSION}
            versions={[
                { version_id: 2, version: "v2" },
                { version_id: 1, version: "v1" },
                { version_id: 0, version: "latest" },
            ]}
        />
    );
};
