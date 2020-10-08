/**
 * @author sriram
 *
 * A dot menu only intended for showing options relevant to a single app
 * i.e. an item or row in the app listing
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { build, DotMenu } from "@cyverse-de/ui-lib";

import ids from "../ids";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import shareIds from "components/sharing/ids";
import Sharing from "components/sharing";
import { formatSharedApps } from "components/sharing/util";
import AppDoc from "components/apps/details/AppDoc";
import QuickLaunchDialog from "../quickLaunch/QuickLaunchDialog";

import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import { FastForward, MenuBook } from "@material-ui/icons";

function RowDotMenu(props) {
    const { baseId, ButtonProps, app, onDetailsSelected, canShare } = props;
    const { t } = useTranslation("apps");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [docDlgOpen, setDocDlgOpen] = useState(false);
    const [qlDlgOpen, setQLDlgOpen] = useState(false);

    const sharingApps = formatSharedApps([app]);
    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    <DetailsMenuItem
                        key={build(baseId, ids.DETAILS_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onDetailsSelected={onDetailsSelected}
                    />,
                    canShare && (
                        <SharingMenuItem
                            key={build(baseId, shareIds.SHARING_MENU_ITEM)}
                            baseId={baseId}
                            onClose={onClose}
                            setSharingDlgOpen={setSharingDlgOpen}
                        />
                    ),
                    <MenuItem
                        key={build(baseId, ids.DOCUMENTATION)}
                        onClick={() => {
                            onClose();
                            setDocDlgOpen(true);
                        }}
                    >
                        <ListItemIcon>
                            <MenuBook fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("documentation")} />
                    </MenuItem>,
                    <MenuItem
                        key={build(baseId, ids.QUICK_LAUNCH)}
                        onClick={() => {
                            onClose();
                            setQLDlgOpen(true);
                        }}
                    >
                        <ListItemIcon>
                            <FastForward fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("quickLaunch")} />
                    </MenuItem>,
                ]}
            />
            <Sharing
                open={sharingDlgOpen}
                onClose={() => setSharingDlgOpen(false)}
                resources={sharingApps}
            />
            <AppDoc
                baseId={build(baseId, ids.DOCUMENTATION)}
                open={docDlgOpen}
                appId={app?.id}
                systemId={app?.system_id}
                name={app?.name}
                onClose={() => setDocDlgOpen(false)}
                isMobile={isMobile}
            />
            <QuickLaunchDialog
                baseDebugId={build(baseId, ids.QUICK_LAUNCH)}
                appName={app?.name}
                appId={app?.id}
                systemId={app?.system_id}
                dialogOpen={qlDlgOpen}
                onHide={() => setQLDlgOpen(false)}
            />
        </>
    );
}

export default RowDotMenu;
