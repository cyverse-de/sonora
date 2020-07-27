import React from "react";

import VICEAdmin from "../../components/vice/admin";

VICEAdminPage.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["vice-admin"] };
};

export default function VICEAdminPage() {
    return <VICEAdmin />;
}
