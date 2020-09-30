import React from "react";
import { build } from "@cyverse-de/ui-lib";

import { TYPE } from "./util";
import {
    Apps,
    Assessment as AnalysisIcon,
    Build as ToolIcon,
    Folder as FolderIcon,
    InsertDriveFileOutlined as FileIcon,
} from "@material-ui/icons";
import ResourceTypes from "../models/ResourceTypes";
import { useTranslation } from "../../i18n";
import Identity from "../data/Identity";

const getItemDetails = (type, t, subtype) => {
    switch (type) {
        case TYPE.DATA: {
            return {
                idFn: (resource) => resource.path,
                labelFn: (resource) => resource.label,
                secondaryText: (resource) => resource.path,
                icon:
                    subtype === ResourceTypes.FILE ? (
                        <FileIcon />
                    ) : (
                        <FolderIcon />
                    ),
            };
        }
        case TYPE.APPS: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                secondaryText: (resource) => resource.system_id,
                icon: <Apps />,
            };
        }
        case TYPE.ANALYSES: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                secondaryText: () => "",
                icon: <AnalysisIcon />,
            };
        }
        case TYPE.TOOLS: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                secondaryText: () => "",
                icon: <ToolIcon />,
            };
        }
        default:
            return null;
    }
};

function SharedItem(props) {
    const { baseId, type, item } = props;
    const subtype = item.type;
    const { t } = useTranslation("common");
    const { idFn, labelFn, icon, secondaryText } = getItemDetails(
        type,
        t,
        subtype
    );

    return (
        <Identity
            id={build(baseId, idFn(item))}
            avatar={icon}
            primaryText={labelFn(item)}
            secondaryText={secondaryText(item)}
        />
    );
}

export default SharedItem;
