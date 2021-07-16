/**
 * @author sriram
 *
 * Drawer Admin Menu items.
 *
 **/
import React from "react";
import clsx from "clsx";
import NavigationConstants from "common/NavigationConstants";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import ids from "./ids";
import styles from "./styles";
import buildID from "components/utils/DebugIDUtil";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

const useStyles = makeStyles(styles);

export default function AdminDrawerItems(props) {
    const { t } = useTranslation(["common"]);
    const router = useRouter();
    const classes = useStyles();
    const { open, activeView } = props;
    return (
        <>
            <ListItem
                id={buildID(ids.DRAWER_MENU, ids.ADMIN_MI)}
                className={
                    activeView === NavigationConstants.ADMIN
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <ListItemIcon>
                    <SupervisorAccountIcon
                        className={classes.icon}
                        fontSize="large"
                    />
                </ListItemIcon>
                {open && <ListItemText>{t("admin")}</ListItemText>}
            </ListItem>
            <Tooltip title={t("apps")} placement="right" arrow>
                <ListItem
                    button
                    id={buildID(ids.DRAWER_MENU, ids.APPS_ADMIN_MI)}
                    className={clsx(classes.nested, classes.listItem)}
                    onClick={() =>
                        router.push(
                            "/" +
                                NavigationConstants.ADMIN +
                                "/" +
                                NavigationConstants.APPS
                        )
                    }
                >
                    <ListItemIcon>
                        <LabelImportantIcon className={classes.icon} />
                    </ListItemIcon>
                    {open && <ListItemText>{t("apps")}</ListItemText>}
                </ListItem>
            </Tooltip>
            <Tooltip title={t("doiRequests")} placement="right" arrow>
                <ListItem
                    button
                    id={buildID(ids.DRAWER_MENU, ids.DOI_ADMIN_MI)}
                    className={clsx(classes.nested, classes.listItem)}
                    onClick={() =>
                        router.push(
                            "/" +
                                NavigationConstants.ADMIN +
                                "/" +
                                NavigationConstants.DOI
                        )
                    }
                >
                    <ListItemIcon>
                        <LabelImportantIcon className={classes.icon} />
                    </ListItemIcon>
                    {open && <ListItemText>{t("doiRequests")}</ListItemText>}
                </ListItem>
            </Tooltip>
            <Tooltip title={t("refGenomes")} placement="right" arrow>
                <ListItem
                    button
                    id={buildID(ids.DRAWER_MENU, ids.REF_GENOME_MI)}
                    className={clsx(classes.nested, classes.listItem)}
                    onClick={() =>
                        router.push(
                            "/" +
                                NavigationConstants.ADMIN +
                                "/" +
                                NavigationConstants.REF_GENOMES
                        )
                    }
                >
                    <ListItemIcon>
                        <LabelImportantIcon className={classes.icon} />
                    </ListItemIcon>
                    {open && <ListItemText>{t("refGenomes")}</ListItemText>}
                </ListItem>
            </Tooltip>
            <Tooltip title={t("tools")} placement="right" arrow>
                <ListItem
                    button
                    id={buildID(ids.DRAWER_MENU, ids.TOOLS_ADMIN_MI)}
                    className={clsx(classes.nested, classes.listItem)}
                    onClick={() =>
                        router.push(
                            "/" +
                                NavigationConstants.ADMIN +
                                "/" +
                                NavigationConstants.TOOLS
                        )
                    }
                >
                    <ListItemIcon>
                        <LabelImportantIcon className={classes.icon} />
                    </ListItemIcon>
                    {open && <ListItemText>{t("tools")}</ListItemText>}
                </ListItem>
            </Tooltip>
            <Tooltip title={t("vice")} placement="right" arrow>
                <ListItem
                    button
                    id={buildID(ids.DRAWER_MENU, ids.VICE_MI)}
                    className={clsx(classes.nested, classes.listItem)}
                    onClick={() =>
                        router.push(
                            "/" +
                                NavigationConstants.ADMIN +
                                "/" +
                                NavigationConstants.VICE
                        )
                    }
                >
                    <ListItemIcon>
                        <LabelImportantIcon className={classes.icon} />
                    </ListItemIcon>
                    {open && <ListItemText>{t("vice")}</ListItemText>}
                </ListItem>
            </Tooltip>
        </>
    );
}
