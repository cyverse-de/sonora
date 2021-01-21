import React from "react";

import VICEAdmin from "../../components/vice/admin";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/utils/error/NotAuthorized";

export default function VICEAdminPage() {
    const profile = useUserProfile()[0];
    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        return <VICEAdmin />;
    }
}

VICEAdminPage.getInitialProps = async () => ({
    namespacesRequired: ["vice-admin"],
});
