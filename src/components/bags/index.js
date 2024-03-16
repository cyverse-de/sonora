import React, { useState, useEffect, useCallback } from "react";

import { useQuery } from "react-query";
import dynamic from "next/dynamic";

import {
    Badge,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    MenuItem,
    Button,
    useMediaQuery,
    Select,
    Tooltip,
    Typography,
    FormControl,
    InputLabel,
    useTheme,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import {
    GetApp,
    People,
    ClearAll,
    Close,
    ShoppingBasket as ShoppingBasketIcon,
} from "@mui/icons-material";

import buildID from "components/utils/DebugIDUtil";
import DeleteButton from "components/utils/DeleteButton";

import constants from "./constants";

import withErrorAnnouncer from "../error/withErrorAnnouncer";
import DownloadLinksDialog from "./downloads";

import * as facade from "../../serviceFacades/bags";
import { Skeleton } from "@mui/material";
import { TYPE as SHARING_TYPE } from "components/sharing/constants";

import { FILE_TYPE, FOLDER_TYPE, ANALYSIS_TYPE, APP_TYPE } from "./classes";
import { useTranslation } from "i18n";
import { useUserProfile } from "contexts/userProfile";
import { useBagInfo } from "contexts/bagInfo";
import { formatBagItems } from "./util";

const SharingView = dynamic(() => import("components/sharing"));

const useStyles = makeStyles()((theme) => ({
    help: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    empty: {
        marginTop: theme.spacing(20),
    },
    paper: {
        width: theme.spacing(60),
        height: theme.spacing(70),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(2),
        width: theme.spacing(20),

        [theme.breakpoints.down("md")]: {
            // width: "100%",
            margin: theme.spacing(1),
            width: theme.spacing(20),
        },
    },
    actionContainer: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "flex-end",
    },
    formControl: {
        minWidth: theme.spacing(20),
    },
    itemText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
    },
}));

const BagSkeleton = () => (
    <Skeleton
        variant="rectangular"
        animation="wave"
        height={100}
        width="100%"
    />
);

export const BagUI = ({ removeItem, allItems, isLoading, fullScreen }) => {
    const { t } = useTranslation(["bags", "common"]);

    const { classes } = useStyles();
    const [filterBy, setFilterBy] = useState(constants.FILTERBY.ALL);

    const [bagItems, setBagItems] = useState([]);

    useEffect(() => {
        switch (filterBy) {
            case constants.FILTERBY.SHAREABLE:
                setBagItems(allItems.filter((item) => item.shareable));
                break;

            case constants.FILTERBY.DOWNLOADABLE:
                setBagItems(allItems.filter((item) => item.downloadable));
                break;

            case constants.FILTERBY.ALL:
            default:
                setBagItems(allItems);
                break;
        }
    }, [allItems, filterBy, setBagItems]);

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
    };

    const baseID = buildID(constants.BASEID, constants.DIALOG);
    const filterID = buildID(baseID, constants.FILTER);
    const filterLabelID = buildID(filterID, constants.LABEL);
    const selectID = buildID(filterID, constants.SELECT);
    const listID = buildID(baseID, constants.LIST);

    return (
        <>
            {isLoading ? (
                <BagSkeleton />
            ) : (
                <>
                    <FormControl
                        variant="standard"
                        className={classes.formControl}
                    >
                        <InputLabel id={filterLabelID}>{t("show")}</InputLabel>
                        <Select
                            variant="standard"
                            labelId={filterLabelID}
                            id={selectID}
                            value={filterBy}
                            onChange={handleFilterChange}
                        >
                            <MenuItem
                                value={constants.FILTERBY.ALL}
                                id={buildID(selectID, constants.FILTERBY.ALL)}
                            >
                                {t("all")}
                            </MenuItem>

                            <MenuItem
                                value={constants.FILTERBY.DOWNLOADABLE}
                                id={buildID(
                                    selectID,
                                    constants.FILTERBY.DOWNLOADABLE
                                )}
                            >
                                {t("downloadable")}
                            </MenuItem>

                            <MenuItem
                                value={constants.FILTERBY.SHAREABLE}
                                id={buildID(
                                    selectID,
                                    constants.FILTERBY.SHAREABLE
                                )}
                            >
                                {t("shareable")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <List id={listID}>
                        {bagItems.map((item, itemIndex) => {
                            const itemID = buildID(listID, itemIndex);
                            return (
                                <ListItem key={itemID} id={itemID}>
                                    {!fullScreen && (
                                        <ListItemAvatar
                                            id={buildID(
                                                itemID,
                                                constants.AVATAR
                                            )}
                                        >
                                            <Avatar>{item.icon(t)}</Avatar>
                                        </ListItemAvatar>
                                    )}
                                    <ListItemText
                                        primary={item.label}
                                        id={buildID(itemID, constants.LABEL)}
                                        classes={{ root: classes.itemText }}
                                    />
                                    <ListItemSecondaryAction>
                                        <DeleteButton
                                            ariaLabel={t("delete")}
                                            baseId={itemID}
                                            component="IconButton"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                removeItem(item);
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}
        </>
    );
};

const defaultSharingResources = () => ({
    [SHARING_TYPE.TOOLS]: [],
    [SHARING_TYPE.APPS]: [],
    [SHARING_TYPE.DATA]: [],
    [SHARING_TYPE.ANALYSES]: [],
});

const Bag = ({ menuIconClass, showErrorAnnouncer }) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const { t } = useTranslation(["bags", "common"]);
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [bagInfo, setBagInfo] = useBagInfo();
    const [badgeCount, setBadgeCount] = useState(0);
    const [bagDlgOpen, setBagDlgOpen] = useState(false);
    const [downloadDlgOpen, setDownloadDlgOpen] = useState(false);
    const [sharingOpen, setSharingOpen] = useState(false);

    const [userProfile] = useUserProfile();

    // Convert the items into a map that the sharing dialog understands.
    const sharingReducer = useCallback((acc, curr) => {
        // Pull up the original, preserved object as the main object
        // passed to the sharing dialog.
        const newObj = { ...curr.item };

        switch (newObj.type) {
            case FILE_TYPE:
            case FOLDER_TYPE:
                acc[SHARING_TYPE.DATA] = [...acc.paths, newObj];
                break;
            case APP_TYPE:
                acc[SHARING_TYPE.APPS] = [...acc.apps, newObj];
                break;
            case ANALYSIS_TYPE:
                acc[SHARING_TYPE.ANALYSES] = [...acc.analyses, newObj];
                break;
            default:
                break;
        }
        return acc;
    }, []);

    if (!menuIconClass) {
        menuIconClass = classes.menuIcon;
    }

    const { isLoading, error } = useQuery(
        facade.DEFAULT_BAG_QUERY_KEY,
        facade.getDefaultBag,
        {
            enabled: !!userProfile?.id,
            onSuccess: setBagInfo,
        }
    );

    const removeItem = facade.useBagRemoveItem({
        handleError: (error) => {
            showErrorAnnouncer(t("removeItemError"), error);
        },
    });

    const clearAll = facade.useBagRemoveItems({
        handleError: (error) => {
            showErrorAnnouncer(t("removeAllItemsError"), error);
        },
    });

    useEffect(() => {
        let count = bagInfo?.contents?.items?.length;
        setBadgeCount(count || 0);
    }, [bagInfo, setBadgeCount]);

    const handleSharingClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setBagDlgOpen(false);
        setSharingOpen(true);
    };

    const handleMenuClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setBagDlgOpen(!bagDlgOpen);
    };

    const handleClose = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setBagDlgOpen(false);
    };

    const handleDownloadClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setDownloadDlgOpen(true);
        setBagDlgOpen(false);
    };

    const allItems = formatBagItems(bagInfo);
    const sharingResources = allItems?.reduce(
        sharingReducer,
        defaultSharingResources()
    );
    const downloadPaths = allItems
        ?.filter((item) => item.downloadable)
        .map((item) => item.path);
    const hasSharingResources = () =>
        Object.entries(sharingResources)
            .map(([_key, value]) => value.length)
            .reduce((acc, curr) => acc + curr) > 0;

    if (error) {
        showErrorAnnouncer(t("fetchBagError"), error);
    }

    const dialogID = buildID(constants.BASEID, constants.DIALOG);
    return (
        <>
            <Tooltip title={t("toolTip")}>
                <IconButton
                    className={menuIconClass}
                    onClick={handleMenuClick}
                    id={buildID(constants.BASEID, constants.MENU)}
                    size="large"
                >
                    <Badge
                        badgeContent={badgeCount}
                        invisible={badgeCount < 1}
                        color="error"
                        id={buildID(
                            constants.BASEID,
                            constants.MENU,
                            constants.BADGE
                        )}
                    >
                        <ShoppingBasketIcon className={"bag-intro"} />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Dialog
                fullScreen={fullScreen}
                open={bagDlgOpen}
                onClose={handleClose}
                classes={{ paper: classes.paper }}
                id={dialogID}
            >
                <DialogTitle id={buildID(dialogID, constants.TITLE)}>
                    {t("yourItemBag")}

                    <Typography
                        component="p"
                        variant="body1"
                        color="textSecondary"
                        classes={{ root: classes.help }}
                        id={buildID(dialogID, constants.TITLE, constants.HELP)}
                    >
                        {t("bagHelp")}
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                        className={classes.closeButton}
                        id={buildID(
                            dialogID,
                            constants.TITLE,
                            constants.CLOSE,
                            constants.button
                        )}
                        size="large"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {allItems?.length > 0 ? (
                        <BagUI
                            allItems={allItems}
                            isLoading={isLoading}
                            removeItem={removeItem}
                            fullScreen={fullScreen}
                        />
                    ) : (
                        <Typography
                            component="p"
                            variant="body1"
                            color="textSecondary"
                            classes={{ root: classes.empty }}
                            id={buildID(dialogID, constants.EMPTY)}
                            align="center"
                        >
                            {t("bagEmpty")}
                        </Typography>
                    )}
                </DialogContent>

                {allItems?.length > 0 && (
                    <DialogActions>
                        {fullScreen ? (
                            <IconButton
                                onClick={() => clearAll()}
                                id={buildID(
                                    dialogID,
                                    constants.CLEARALL,
                                    constants.BUTTON
                                )}
                                size="large"
                            >
                                <ClearAll />
                            </IconButton>
                        ) : (
                            <Button
                                variant="contained"
                                className={classes.button}
                                startIcon={<ClearAll />}
                                size="small"
                                onClick={() => clearAll()}
                                id={buildID(
                                    dialogID,
                                    constants.CLEARALL,
                                    constants.BUTTON
                                )}
                            >
                                {t("clearBag")}
                            </Button>
                        )}

                        {downloadPaths.length > 0 ? (
                            fullScreen ? (
                                <IconButton
                                    onClick={handleDownloadClick}
                                    id={buildID(
                                        dialogID,
                                        constants.DOWNLOAD,
                                        constants.BUTTON
                                    )}
                                    size="large"
                                >
                                    <GetApp />
                                </IconButton>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<GetApp />}
                                    onClick={handleDownloadClick}
                                    size="small"
                                    id={buildID(
                                        dialogID,
                                        constants.DOWNLOAD,
                                        constants.BUTTON
                                    )}
                                >
                                    {t("download")}
                                </Button>
                            )
                        ) : null}

                        {hasSharingResources() &&
                            (fullScreen ? (
                                <IconButton
                                    onClick={handleSharingClick}
                                    id={buildID(
                                        dialogID,
                                        constants.SHARE,
                                        constants.BUTTON
                                    )}
                                    size="large"
                                >
                                    <People />
                                </IconButton>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<People />}
                                    onClick={handleSharingClick}
                                    size="small"
                                    id={buildID(
                                        dialogID,
                                        constants.SHARE,
                                        constants.BUTTON
                                    )}
                                >
                                    {t("share")}
                                </Button>
                            ))}
                    </DialogActions>
                )}
            </Dialog>

            {userProfile && (
                <>
                    <SharingView
                        open={sharingOpen}
                        onClose={() => {
                            setSharingOpen(false);
                        }}
                        resources={sharingResources}
                    />

                    <DownloadLinksDialog
                        open={downloadDlgOpen}
                        onClose={() => setDownloadDlgOpen(false)}
                        paths={downloadPaths}
                        fullScreen={fullScreen}
                    />
                </>
            )}
        </>
    );
};

export { FILE_TYPE, FOLDER_TYPE, ANALYSIS_TYPE, APP_TYPE };
export default withErrorAnnouncer(Bag);
