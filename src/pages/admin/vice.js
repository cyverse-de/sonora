import React from "react";

import VICEAdmin from "../../components/vice/admin";

export default function VICEAdminPage() {
    return <VICEAdmin />;
}

VICEAdminPage.getInitialProps = async () => ({
    namespacesRequired: ["vice-admin"],
});
