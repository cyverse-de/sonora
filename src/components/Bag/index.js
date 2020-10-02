import React, { useState, useEffect } from "react";

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
    makeStyles,
    Button,
    useMediaQuery,
    Tabs,
    Tab,
    Typography,
} from "@material-ui/core";
import {
    Delete,
    GetApp,
    People,
    Clear,
    ClearAll,
    Close,
    ShoppingBasket as ShoppingBasketIcon,
} from "@material-ui/icons";

import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";

import SharingView from "../sharing";

import * as facade from "../../serviceFacades/bags";
import { Skeleton } from "@material-ui/lab";

import {
    createNewBagItem,
    FILE_TYPE,
    FOLDER_TYPE,
    ANALYSIS_TYPE,
    APP_TYPE,
} from "./classes";
import { useTranslation } from "i18n";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    help: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
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

        [theme.breakpoints.down("sm")]: {
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
}));

const BagSkeleton = () => (
    <Skeleton variant="rect" animation="wave" height={100} width="100%" />
);

const BagTab = ({ id, value, index, bagItems, showErrorAnnouncer }) => {
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);
    const [tabItems, setTabItems] = useState([]);

    const removeItem = facade.useBagRemoveItem({
        handleError: (error) => {
            showErrorAnnouncer(t("removeItemError"), error);
        },
    });

    useEffect(() => {
        setTabItems(bagItems);
    }, [setTabItems, bagItems]);

    return (
        <div hidden={value !== index} id={id}>
            <List classes={{ root: classes.list }}>
                {tabItems.map((tabItem, tabIndex) => {
                    return (
                        <ListItem key={tabIndex}>
                            <ListItemAvatar>
                                <Avatar>{tabItem.icon(t)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={tabItem.label} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label={t("delete")}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        removeItem(tabItem);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};

export const BagUI = ({ items, isLoading, showErrorAnnouncer }) => {
    const { t } = useTranslation(["bags", "common"]);
    const [tabValue, setTabValue] = useState(0);

    const [shareableItems, setShareableItems] = useState([]);
    const [downloadableItems, setDownloadableItems] = useState([]);

    useEffect(() => {
        const bagItems = items.map((item) => createNewBagItem(item));
        setShareableItems(bagItems.filter((item) => item.shareable));
        setDownloadableItems(bagItems.filter((item) => item.downloadable));
    }, [items, isLoading]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            {isLoading ? (
                <BagSkeleton />
            ) : (
                <>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label={t("download")} />
                        <Tab label={t("share")}></Tab>
                    </Tabs>

                    <BagTab
                        value={tabValue}
                        index={0}
                        bagItems={downloadableItems}
                        translationKey="download"
                        showErrorAnnouncer={showErrorAnnouncer}
                    />

                    <BagTab
                        value={tabValue}
                        index={1}
                        bagItems={shareableItems}
                        translationKey="share"
                        showErrorAnnouncer={showErrorAnnouncer}
                    />
                </>
            )}
        </>
    );
};

const Bag = ({ menuIconClass, showErrorAnnouncer }) => {
    const theme = useTheme();
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    if (!menuIconClass) {
        menuIconClass = classes.menuIcon;
    }

    const { isLoading, isError: hasErrored, data, error } = facade.useBag();

    const [badgeCount, setBadgeCount] = useState(0);
    const [bagItems, setBagItems] = useState([]);

    useEffect(() => {
        if (hasErrored) {
            showErrorAnnouncer(t("fetchBagError"), error);
        }
    }, [hasErrored, error, showErrorAnnouncer, t]);

    useEffect(() => {
        setBagItems(data?.items || []);
    }, [data, setBagItems]);

    useEffect(() => {
        setBadgeCount(bagItems.length);
    }, [bagItems, setBadgeCount]);

    const [bagDlgOpen, setBagDlgOpen] = useState(false);
    const [sharingOpen, setSharingOpen] = useState(false);
    const [sharingResources, setSharingResources] = useState({
        tools: [],
        apps: [],
        paths: [],
        analyses: [],
        unknown: [],
    });

    const sharingReducer = (acc, curr) => {
        switch (curr.type) {
            case FILE_TYPE:
            case FOLDER_TYPE:
                if (!curr.label) {
                    curr.label = curr.path.substr(
                        curr.path.lastIndexOf("/") + 1
                    );
                }
                acc.paths = [...acc.paths, curr];
                break;
            case APP_TYPE:
                acc.apps = [...acc.apps, curr];
                break;
            case ANALYSIS_TYPE:
                acc.analyses = [...acc.analyses, curr];
                break;
            default:
                acc.unknown = [...acc.unknown, curr];
                break;
        }
        return acc;
    };

    const handleSharingClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setSharingResources(bagItems.reduce(sharingReducer, sharingResources));
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

    const clearAll = facade.useBagRemoveItems({
        handleError: (error) => {
            showErrorAnnouncer(t("removeAllItemsError"), error);
        },
    });

    return (
        <>
            <IconButton className={menuIconClass} onClick={handleMenuClick}>
                <Badge
                    badgeContent={badgeCount}
                    invisible={badgeCount < 1}
                    color="error"
                >
                    <ShoppingBasketIcon />
                </Badge>
            </IconButton>

            <Dialog
                fullScreen={fullScreen}
                open={bagDlgOpen}
                onClose={handleClose}
                classes={{ paper: classes.paper }}
            >
                <DialogTitle>
                    {t("yourItemBag")}

                    <Typography
                        component="p"
                        variant="body1"
                        color="textSecondary"
                        classes={{ root: classes.help }}
                    >
                        {t("bagHelp")}
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                        className={classes.closeButton}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <BagUI
                        isLoading={isLoading}
                        items={bagItems}
                        showErrorAnnouncer={showErrorAnnouncer}
                    />
                </DialogContent>

                <DialogActions>
                    {fullScreen ? (
                        <IconButton onClick={() => clearAll()}>
                            <ClearAll />
                        </IconButton>
                    ) : (
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            startIcon={<Clear />}
                            size="small"
                            onClick={() => clearAll()}
                        >
                            {t("clearBag")}
                        </Button>
                    )}

                    {fullScreen ? (
                        <IconButton onClick={() => {}}>
                            <GetApp />
                        </IconButton>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<GetApp />}
                            onClick={() => {}}
                            disabled={true}
                            size="small"
                        >
                            {t("download")}
                        </Button>
                    )}

                    {fullScreen ? (
                        <IconButton onClick={handleSharingClick}>
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
                        >
                            {t("share")}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <SharingView
                open={sharingOpen}
                onClose={() => {
                    setSharingOpen(false);
                }}
                resources={sharingResources}
            />
        </>
    );
};

export { FILE_TYPE, FOLDER_TYPE, ANALYSIS_TYPE, APP_TYPE };
export default withErrorAnnouncer(Bag);
