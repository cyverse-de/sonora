import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import HttpOutlinedIcon from "@material-ui/icons/HttpOutlined";
import IconButton from "@material-ui/core/IconButton";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    browseButtonContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },
    uploadDialogPaper: {
        minHeight: "40vh",
        maxHeight: "66vh",
    },
    uploadCard: {
        border: "dashed lightgray",
        marginBotton: "5px",
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
        borderColor: theme.palette.lightSilver,
        border: "solid 1px",
    },
    listSubheader: {
        background: theme.palette.lightSilver,
    },
    textFieldContainer: {
        marginTop: "20px",
        marginBottom: "20px",
        display: "flex",
    },
    textField: {
        width: "88%",
    },
}));

const UploadDialog = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const classes = useStyles();
    const { destination } = props;

    const UploadList = () => {
        return (
            <List
                subheader={
                    <ListSubheader className={classes.listSubheader}>
                        Files to upload
                    </ListSubheader>
                }
                className={classes.fileList}
            >
                <ListItem>
                    <ListItemIcon>
                        <InsertDriveFileOutlinedIcon />
                    </ListItemIcon>

                    <ListItemText id="test-filename" primary="test-filename" />

                    <ListItemSecondaryAction>
                        <IconButton aria-label="remove">
                            <RemoveCircleIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>

                <Divider variant="inset" />

                <ListItem>
                    <ListItemIcon>
                        <HttpOutlinedIcon />
                    </ListItemIcon>

                    <ListItemText
                        id="test-URL"
                        primary="http://de.cyverse.org/terrain/docs"
                    />

                    <ListItemSecondaryAction>
                        <IconButton aria-label="remove">
                            <RemoveCircleIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        );
    };

    const URLImportTextField = () => {
        return (
            <div className={classes.textFieldContainer}>
                <TextField
                    id="url-text-field"
                    label="Add URL to Import"
                    className={classes.textField}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <HttpOutlinedIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <IconButton aria-label="add-url-import">
                    <AddCircleIcon />
                </IconButton>
            </div>
        );
    };

    const UploadCard = () => {
        return (
            <Card variant="outlined" className={classes.uploadCard}>
                <CardContent style={{ height: "100%" }}>
                    <Typography
                        align="center"
                        className={classes.uploadCardTypography}
                        paragraph={true}
                        variant="body1"
                    >
                        Drop files or URLs here to queue them for upload to the
                        data store
                    </Typography>

                    <Typography
                        align="center"
                        className={classes.uploadCardTypography}
                        paragraph={true}
                        variant="body1"
                    >
                        or
                    </Typography>

                    <div className={classes.browseButtonContainer}>
                        <Button variant="contained" color="primary">
                            Browse
                        </Button>
                    </div>

                    <Typography
                        align="center"
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
                </CardContent>
            </Card>
        );
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={open}
                onClose={handleClose}
                aria-labelledby="upload-dialog-title"
                classes={{ paper: classes.uploadDialogPaper }}
            >
                <DialogTitle className={classes.uploadDialogTitle}>
                    Upload to {destination}
                </DialogTitle>

                <DialogContent className={classes.root}>
                    <UploadCard />

                    <URLImportTextField />

                    <UploadList />
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
