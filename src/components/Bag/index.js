import React, { useState } from "react";

import {
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
import { Delete, GetApp, People, Close } from "@material-ui/icons";

import { useQuery } from "react-query";
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
            width: "100%",
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

const BagTab = ({ id, value, index, bagItems }) => {
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);
    const [tabItems, setTabItems] = useState([...bagItems]);

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
                                    onClick={() => {
                                        let newItems = [...tabItems];
                                        newItems.splice(tabIndex, 1);
                                        setTabItems(newItems);
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

export const BagUI = ({ downloadableItems, shareableItems, isLoading }) => {
    const { t } = useTranslation(["bags", "common"]);
    const [tabValue, setTabValue] = useState(0);

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
                    />

                    <BagTab
                        value={tabValue}
                        index={1}
                        bagItems={shareableItems}
                        translationKey="share"
                    />
                </>
            )}
        </>
    );
};

export default ({ open, remove = () => {}, onClose }) => {
    const theme = useTheme();
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { isLoading, status, data, error } = useQuery(
        [facade.DEFAULT_BAG_QUERY_KEY],
        facade.getDefaultBag
    );

    const hasErrored = status === "error";

    if (hasErrored) {
        console.log(error.message);
    }

    let bagItems = data?.items || [];
    bagItems = bagItems.map((item) => createNewBagItem(item));

    const shareableItems = bagItems.filter((item) => item.shareable);
    const downloadableItems = bagItems.filter((item) => item.downloadable);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
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

                <IconButton onClick={onClose} className={classes.closeButton}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <BagUI
                    isLoading={isLoading}
                    shareableItems={shareableItems}
                    downloadableItems={downloadableItems}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<GetApp />}
                    onClick={() => {}}
                >
                    {t("download")}
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<People />}
                    onClick={() => {}}
                >
                    {t("share")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { FILE_TYPE, FOLDER_TYPE, ANALYSIS_TYPE, APP_TYPE };
