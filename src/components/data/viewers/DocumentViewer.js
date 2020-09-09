/**
 * view pdf, xml and other docs.
 * 
 * @author sriram
 * 
 */
import React, {useEffect} from "react";
import { useTranslation } from "i18n";

import { Typography } from "@material-ui/core";


export default function DocumentViewer(props) {
    const {path} = props;
    const { t } = useTranslation("data");
    useEffect(()=> {
        const protocol = window.location.protocol;
        const slashes = protocol.concat("//");
        const host = slashes.concat(window.location.host);
        window.open(
            `${host}/api/download?path=${path}`,
            "_blank"
        );
    },[path]);

    return(
        <Typography>{t("disablePopup")}</Typography>
    )

}