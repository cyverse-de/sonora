import React from "react";
import { Hidden } from "@material-ui/core";
import GlobalSearchField from "../components/search/GlobalSearchField";
import { useRouter } from "next/router";

export default function Search() {
    const router = useRouter();
    const searchTerm = router?.query?.searchTerm;
    const filter = router?.query.filter;
    return (
        <>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <GlobalSearchField />
            </Hidden>
            <div>Global search page!</div>
            {searchTerm && (
                <div>
                    Searching for {searchTerm} with filter {filter}
                </div>
            )}
        </>
    );
}

Search.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["common"] };
};
