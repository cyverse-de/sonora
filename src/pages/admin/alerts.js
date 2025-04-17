import React, { useState } from "react";

import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

import AlertsEditor from "components/alerts/admin/AlertsAdmin";

export default function AlertsAdminPage() {
    const profile = useUserProfile()[0];
    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        return <AlertsEditor />;
    }
}
