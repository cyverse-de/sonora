import React from "react";
import buildID from "components/utils/DebugIDUtil";

import { TYPE } from "./constants";
import {
    Build as ToolIcon,
    Folder as FolderIcon,
    InsertDriveFileOutlined as FileIcon,
    Apps as AppsIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import ResourceTypes from "../models/ResourceTypes";
import { useTranslation } from "i18n";
import Identity from "../data/Identity";
import styles from "./styles";
import AnalysesIcon from "components/icons/AnalysesIcon";

const useStyles = makeStyles(styles);

const getItemDetails = (type, t, classes, subtype) => {
    switch (type) {
        case TYPE.DATA: {
            return {
                idFn: (resource) => resource.path,
                labelFn: (resource) => resource.label,
                secondaryText: (resource) => resource.path,
                icon:
                    subtype === ResourceTypes.FILE ? (
                        <FileIcon className={classes.icon} />
                    ) : (
                        <FolderIcon className={classes.icon} />
                    ),
            };
        }
        case TYPE.APPS: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                secondaryText: (resource) => resource.system_id,
                icon: <AppsIcon className={classes.icon} />,
            };
        }
        case TYPE.ANALYSES: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                secondaryText: () => "",
                icon: <AnalysesIcon className={classes.icon} />,
            };
        }
        case TYPE.TOOLS: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                secondaryText: () => "",
                icon: <ToolIcon className={classes.icon} />,
            };
        }
        default:
            return null;
    }
};

function SharedItem(props) {
    const { baseId, type, item } = props;
    const classes = useStyles();
    const subtype = item.type;
    const { t } = useTranslation("common");
    const { idFn, labelFn, icon, secondaryText } = getItemDetails(
        type,
        t,
        classes,
        subtype
    );

    return (
        <Identity
            id={buildID(baseId, idFn(item))}
            avatar={icon}
            primaryText={labelFn(item)}
            secondaryText={secondaryText(item)}
        />
    );
}

export default SharedItem;
