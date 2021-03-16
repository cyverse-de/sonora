import React from "react";
import AccessRequestDialog from "components/vice/AccessRequestDialog";

export default {
    title: "VICE / Access Request",
};

export const VICEAccessRequestTest = () => {
    return (
        <AccessRequestDialog
            open={true}
            baseId="viceAccess"
            onClose={() => console.log("Close this dialog")}
        />
    );
};
