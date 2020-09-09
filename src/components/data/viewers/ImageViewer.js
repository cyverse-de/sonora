/**
 * View images
 *
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import Toolbar from "./Toolbar";
import { parseNameFromPath } from "../utils";

import PageWrapper from "components/layout/PageWrapper";
import { Typography } from "@material-ui/core";

export default function ImageViewer(props) {
    const { path, resourceId } = props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");
    useEffect(() => {
        const protocol = window.location.protocol;
        const slashes = protocol.concat("//");
        const host = slashes.concat(window.location.host);
        setUrl(`${host}/api/download?path=${path}`);
    }, [path]);

    if (url) {
        return (
            <PageWrapper appBarHeight={120}>
                <Toolbar
                    path={path}
                    resourceId={resourceId}
                    allowLineNumbers={false}
                />
                <img
                    src={`${url}`}
                    alt={parseNameFromPath(path)}
                    style={{ overflow: "auto" }}
                />
            </PageWrapper>
        );
    } else {
        return <Typography>{t("loading")}</Typography>;
    }
}
