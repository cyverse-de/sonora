/**
 * View images
 *
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import ids from "./ids";
import Toolbar from "./Toolbar";
import { parseNameFromPath } from "../utils";

import { build } from "@cyverse-de/ui-lib";
import PageWrapper from "components/layout/PageWrapper";
import { Typography } from "@material-ui/core";

export default function ImageViewer(props) {
    const { baseId, path, resourceId } = props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");
    const fileName = parseNameFromPath(path);
    useEffect(() => {
        const protocol = window.location.protocol.concat("//");
        const host = protocol.concat(window.location.host);
        setUrl(`${host}/api/download?path=${path}`);
    }, [path]);

    if (url) {
        return (
            <PageWrapper appBarHeight={120}>
                <Toolbar
                    baseId={build(baseId, ids.VIEWER_IMAGE, ids.TOOLBAR)}
                    path={path}
                    resourceId={resourceId}
                    allowLineNumbers={false}
                />
                <img
                    id={build(baseId, ids.VIEWER_IMAGE, fileName)}
                    src={`${url}`}
                    alt={fileName}
                    style={{ overflow: "auto" }}
                />
            </PageWrapper>
        );
    } else {
        return <Typography>{t("loading")}</Typography>;
    }
}
