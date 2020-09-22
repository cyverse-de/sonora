/**
 * @author sriram
 *
 * A dot menu intended for the Apps view.
 */

import React from "react";
import { useTranslation } from "i18n";
import ids from "../ids";
import shareIds from "components/sharing/ids";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { FilterList, Info } from "@material-ui/icons";
import SharingMenuItem from "../../sharing/SharingMenuItem";

function AppsDotMenu(props) {
    const {
        baseId,
        ButtonProps,
        detailsEnabled,
        onDetailsSelected,
        onFilterSelected,
        canShare,
        setSharingDlgOpen,
    } = props;
    const { t } = useTranslation("apps");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            render={(onClose) => [
                detailsEnabled && (
                    <MenuItem
                        key={build(baseId, ids.DETAILS_MENU_ITEM)}
                        id={build(baseId, ids.DETAILS_MENU_ITEM)}
                        onClick={() => {
                            onClose();
                            onDetailsSelected();
                        }}
                    >
                        <ListItemIcon>
                            <Info fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("details")} />
                    </MenuItem>
                ),
                isMobile && (
                    <MenuItem
                        key={build(baseId, ids.FILTER_MENU_ITEM)}
                        id={build(baseId, ids.FILTER_MENU_ITEM)}
                        onClick={() => {
                            onClose();
                            onFilterSelected();
                        }}
                    >
                        <ListItemIcon>
                            <FilterList fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("filterLbl")} />
                    </MenuItem>
                ),
                canShare && (
                    <SharingMenuItem
                        key={build(baseId, shareIds.SHARING_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                ),
            ]}
        />
    );
}

export default AppsDotMenu;
