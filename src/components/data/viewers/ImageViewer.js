/**
 * View images
 *
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";

import PageWrapper from "components/layout/PageWrapper";
import { useTranslation } from "i18n";

import { getHost } from "../../utils/getHost";
import ids from "./ids";
import Toolbar from "./Toolbar";

import buildID from "components/utils/DebugIDUtil";
import { Typography } from "@mui/material";

export default function ImageViewer(props) {
    const { baseId, path, resourceId, handlePathChange, onRefresh, fileName } =
        props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(`${getHost()}/api/download?path=${encodeURIComponent(path)}`);
    }, [path]);

    if (url) {
        return (
            <PageWrapper appBarHeight={120}>
                <Toolbar
                    baseId={buildID(baseId, ids.VIEWER_IMAGE, ids.TOOLBAR)}
                    path={path}
                    resourceId={resourceId}
                    allowLineNumbers={false}
                    handlePathChange={handlePathChange}
                    onRefresh={onRefresh}
                    fileName={fileName}
                />
                <div>
                    <img
                        id={buildID(baseId, ids.VIEWER_IMAGE, fileName)}
                        src={`${url}`}
                        alt={fileName}
                        style={{ overflow: "auto" }}
                    />
                </div>
            </PageWrapper>
        );
    } else {
        return <Typography>{t("loading")}</Typography>;
    }
}
