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

import { themePalette } from "../theme/default";

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
        marginTop: "10px",
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

const setupEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
};

/**
 * Callback that is called in the 'onDrop' event handler for UploadCard.
 * It's called for each item in the event's dataTransferItems array.
 *
 * See the following for references:
 * - https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
 *
 * @callback dropFn
 * @params {object} event - The object representing the 'drop' event.
 * @params {object} item - The DataTransferItem being handled.
 * @returns null
 */

/**
 * UploadCard supports dragging files and URLs into the card and passing the
 * items to the callback. Adapted from code at https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929.
 *
 * @params {object} props
 * @returns {object}
 */
export const UploadCard = (props) => {
    const classes = useStyles();
    const [dragCounter, setDragCounter] = useState(0);
    const { dropFn } = props;

    const handleDrag = (event) => {
        setupEvent(event);
    };

    const handleDragIn = (event) => {
        setupEvent(event);

        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setDragCounter(dragCounter + 1);
        }
    };

    const handleDragOut = (event) => {
        setupEvent(event);

        if (dragCounter > 0) {
            setDragCounter(dragCounter - 1);
        }
    };

    const handleDrop = (event) => {
        setupEvent(event);
        setDragCounter(0);
        dropFn(event, event.dataTransfer.items);
    };

    return (
        <Card
            variant="outlined"
            className={classes.uploadCard}
            style={{
                borderColor:
                    dragCounter > 0
                        ? themePalette.primary.main
                        : themePalette.lightSilver,
            }}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <CardContent style={{ height: "100%" }}>
                <Typography
                    align="center"
                    className={classes.uploadCardTypography}
                    paragraph={true}
                    variant="body1"
                >
                    Drop files or URLs here to queue them for upload to the data
                    store
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
                    <Link href="#" onClick={(event) => event.preventDefault()}>
                        Learn more.
                    </Link>
                </Typography>
            </CardContent>
        </Card>
    );
};

const UploadList = (props) => {
    const classes = useStyles();
    const { items } = props;

    return (
        <List
            subheader={
                <ListSubheader className={classes.listSubheader}>
                    Files to upload
                </ListSubheader>
            }
            className={classes.fileList}
        >
            {items.map((item, index) => (
                <React.Fragment key={`upload-list-${index}`}>
                    <ListItem id={`upload-list-${index}`}>
                        <ListItemIcon>
                            {typeof item === "object" ? (
                                // object in this case is a file.
                                <InsertDriveFileOutlinedIcon />
                            ) : (
                                // otherwise it's a string containing a URL
                                <HttpOutlinedIcon />
                            )}
                        </ListItemIcon>

                        {typeof item === "object" ? (
                            // object in this case is a file
                            <ListItemText id={item.name} primary={item.name} />
                        ) : (
                            // otherwise it's a string containing a URL
                            <ListItemText id={item} primary={item} />
                        )}

                        <ListItemSecondaryAction>
                            <IconButton aria-label="remove">
                                <RemoveCircleIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>

                    {index < items.length - 1 ? (
                        <Divider variant="inset" />
                    ) : (
                        ""
                    )}
                </React.Fragment>
            ))}
        </List>
    );
};

const URLImportTextField = () => {
    const classes = useStyles();

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

/**
 * Turns a DataTransferItemList into an actual array/list.
 * @param {DataTransferItemList} dtil - The DataTransferItemList to convert.
 * @returns {Array<object>}
 */
const convertDTIL = (dtil) => {
    let retval = [];

    for (var item of dtil) {
        retval = [...retval, item];
    }

    return retval;
};

const promiseGetAsString = (item) => {
    return new Promise((resolve, _reject) =>
        item.getAsString((s) => resolve(s))
    );
};

const getURLs = (str) => str.match(/(https?:\/\/[^ \\(\\)]*)/g);

/**
 * Handles uploads to the data store.
 *
 * @param {object} props - Contains the 'destination' string.
 * @return {object}
 */
const UploadDialog = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const [uploadItems, setUploadItems] = useState([]);
    const classes = useStyles();
    const { destination } = props;

    // Callback for the UploadCard.
    const dropFn = async (_, items) => {
        let allItems = convertDTIL(items);
        let stringItems = await Promise.all(
            allItems
                .filter((i) => i.kind === "string")
                .map(async (item) => {
                    const itemString = await promiseGetAsString(item);
                    return getURLs(itemString);
                })
        );

        stringItems = stringItems.flat(Infinity);

        let fileItems = allItems
            .filter((i) => i.kind === "file")
            .map((i) => i.getAsFile())
            .filter((f) => f.size > 0);

        let cleanItems = [...stringItems, ...fileItems];

        cleanItems = cleanItems.filter((i) => i !== null && i !== "undefined");

        // Set the new value of uploadItems.
        setUploadItems([...uploadItems, ...cleanItems]);
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
                    <UploadCard dropFn={dropFn} />

                    <URLImportTextField />

                    <UploadList items={uploadItems} />
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
