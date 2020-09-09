/**
 * View images
 *
 *
 * @author sriram
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { parseNameFromPath } from "../utils";
import { Typography } from "@material-ui/core";

export default function ImageViewer(props) {
    const { path } = props;
    const { t } = useTranslation("data");
    const [url, setUrl] = useState("");
    useEffect(() => {
        const protocol = window.location.protocol;
        const slashes = protocol.concat("//");
        const host = slashes.concat(window.location.host);
        setUrl(`${host}/api/download?path=${path}`);
    }, [path]);

    if(url) {
    return <img src={`${url}`} alt={parseNameFromPath(path)} />;
    } else {
        return  <Typography>{t("loading")}</Typography>
    }
}
