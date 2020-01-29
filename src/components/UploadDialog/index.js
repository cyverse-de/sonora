import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
//import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
//import Paper from "@material-ui/core/Paper";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: "0px 4px 8px 4px",
    },
    uploadFieldPaper: {
        height: 200,
        textAlign: "center",
        color: theme.palette.text.secondary,
        border: "solid red",
    },
    browseButton: {
        backgroundColor: theme.palette.primary,
    },
    uploadCard: {
        minHeight: 200,
        border: "dashed lightgray",
    },
    uploadCardContent: {
        minHeight: 160,
    },
    uploadCardTypography: {
        color: theme.palette.text.secondary,
    },
    uploadDialogTitle: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    uploadDialogActions: {
        background: theme.palette.lightSilver,
    },
    fileList: {
        height: "100%",
        borderLeft: `solid ${theme.palette.lightSilver}`,
    },
}));

const UploadDialogPanel = (props) => {
    const classes = useStyles();

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Card variant="outlined" className={classes.uploadCard}>
                        <CardContent className={classes.uploadCardContent}>
                            <Typography
                                align="center"
                                className={classes.uploadCardTypography}
                                paragraph={true}
                                variant="body1"
                            >
                                Drag and drop files here to upload them to the
                                data store.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.browseButton}
                    >
                        Browse
                    </Button>
                </Grid>
                <Grid item xs={9}>
                    <Typography
                        align="left"
                        className={classes.uploadCardTypography}
                        paragraph={true}
                        variant="caption"
                    >
                        Manual upload with third-party apps: &nbsp;
                        <Link
                            href="#"
                            onClick={(event) => event.preventDefault()}
                        >
                            Learn more.
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
};

const UploadDialogTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`upload-dialog-tabpanel-${index}`}
            aria-labelledby={`upload-dialog-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
};

const useTabStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const UploadDialogTabs = (props) => {
    const classes = useTabStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <div className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="upload-dialog-tabs"
                >
                    <Tab label="Upload" />
                    <Tab label="URL Import" />
                    <Tab label="CoGe Import" />
                </Tabs>

                <UploadDialogTabPanel value={value} index={0}>
                    <UploadDialogPanel />
                </UploadDialogTabPanel>

                <UploadDialogTabPanel value={value} index={1}>
                    URL Import Tab Panel
                </UploadDialogTabPanel>

                <UploadDialogTabPanel value={value} index={2}>
                    CoGe Import
                </UploadDialogTabPanel>
            </div>
        </>
    );
};

const UploadDialog = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const classes = useStyles();
    const { destination } = props;

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                onClose={handleClose}
                aria-labelledby="upload-dialog-title"
            >
                <DialogTitle className={classes.uploadDialogTitle}>
                    Upload to {destination}
                </DialogTitle>
                <DialogContent className={classes.root}>
                    <Grid container spacing={1}>
                        <Grid container item key="upload-area" xs={8}>
                            <UploadDialogTabs />
                        </Grid>

                        <Grid item key="upload-list" xs={4}>
                            <List
                                subheader={
                                    <ListSubheader>
                                        Files to upload
                                    </ListSubheader>
                                }
                                className={classes.fileList}
                            >
                                <ListItem>
                                    <ListItemText
                                        id="test-filename"
                                        primary="test-filename"
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="remove">
                                            <RemoveCircleIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.uploadDialogActions}>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UploadDialog;
