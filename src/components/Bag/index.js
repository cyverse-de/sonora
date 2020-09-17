import React, { useState } from "react";

import {
    Dialog,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    makeStyles,
    Typography,
    Button,
    useMediaQuery,
    Tabs,
    Tab,
} from "@material-ui/core";
import { Delete, GetApp, People } from "@material-ui/icons";

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
    paper: {
        width: theme.spacing(80),

        [theme.breakpoints.down("sm")]: {
            width: "90%",
        },
    },
    title: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    help: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        overflowWrap: "break-word",
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

const BagTab = ({
    id,
    value,
    index,
    bagItems,
    remove,
    onClick = () => {},
    translationKey,
    startIcon,
}) => {
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);

    return (
        <div hidden={value !== index} id={id}>
            <List>
                {bagItems.map((bagItem, index) => {
                    return (
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar>{bagItem.icon(t)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={bagItem.label} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label={t("delete")}
                                    onClick={remove(index)}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>

            <div className={classes.actionContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={startIcon}
                    onClick={onClick}
                >
                    {t(translationKey)}
                </Button>
            </div>
        </div>
    );
};

export const BagUI = ({ remove }) => {
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);

    const { status, data, error } = useQuery(
        [facade.DEFAULT_BAG_QUERY_KEY],
        facade.getDefaultBag
    );

    const isLoading = status === "loading";
    const hasErrored = status === "error";

    if (hasErrored) {
        console.log(error.message);
    }

    let bagItems = data?.items || [];
    bagItems = bagItems.map((item) => createNewBagItem(item));

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
                    <Typography variant="h4" className={classes.title}>
                        {t("yourItemBag")}
                    </Typography>
                    <Typography variant="body1" className={classes.help}>
                        {t("bagHelp")}
                    </Typography>

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
                        bagItems={bagItems}
                        remove={remove}
                        translationKey="download"
                        startIcon={<GetApp />}
                    />

                    <BagTab
                        value={tabValue}
                        index={1}
                        bagItems={bagItems}
                        remove={remove}
                        translationKey="share"
                        startIcon={<People />}
                    />
                </>
            )}
        </>
    );
};

export default ({ open, remove, onClose }) => {
    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
            <BagUI remove={remove} />
        </Dialog>
    );
};

export { FILE_TYPE, FOLDER_TYPE, ANALYSIS_TYPE, APP_TYPE };
