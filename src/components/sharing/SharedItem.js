import React from "react";
import { build } from "@cyverse-de/ui-lib";
import { Chip, makeStyles } from "@material-ui/core";

import { TYPE } from "./util";
import styles from "./styles";
import {
    Apps,
    Assessment as AnalysisIcon,
    Build as ToolIcon,
    Folder as FolderIcon,
    InsertDriveFileOutlined as FileIcon,
} from "@material-ui/icons";
import ResourceTypes from "../models/ResourceTypes";
const useStyles = makeStyles(styles);

const getItemDetails = (type, subtype) => {
    switch (type) {
        case TYPE.DATA: {
            return {
                idFn: (resource) => resource.path,
                labelFn: (resource) => resource.label,
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
                icon: <Apps />,
            };
        }
        case TYPE.ANALYSES: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
                icon: <AnalysisIcon />,
            };
        }
        case TYPE.TOOLS: {
            return {
                idFn: (resource) => resource.id,
                labelFn: (resource) => resource.name,
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
    const { idFn, labelFn, icon } = getItemDetails(type, subtype);
    const classes = useStyles();

    return (
        <Chip
            id={build(baseId, idFn(item))}
            classes={{ root: classes.chip }}
            label={labelFn(item)}
            icon={icon}
            color="primary"
            variant="outlined"
        />
    );
}

export default SharedItem;
