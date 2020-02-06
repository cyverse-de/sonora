import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import UploadIcon from "mdi-react/UploadIcon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
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
    dialogClose: {
        color: theme.palette.black,
    },
    uploadCardTypography: {
        color: theme.palette.text.secondary,
    },
    textFieldContainer: {
        display: "flex",
    },
    textField: {
        width: "100%",
    },
}));

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

const setupEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
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

const KindFile = "File";

/**
 * A normalized object representing something dropped into an element.
 *
 * @typedef DroppedItem
 * @property {string} kind - For now, will be set to 'File'.
 * @property {File} value - The File object.
 */

/**
 * The function that the list of dropped files is passed to for further processing.
 * You should define the return value.
 *
 * @callback itemsFn
 * @param {Array<DroppedItem>}
 * @returns null
 */

/**
 * A handler for processing files dropped into a window. See the usage in UploadCard.
 * Converts the items in the list into a cleaned up list of DroppedItems objects.
 *
 * @param {Array<Object>} transferItemList - The DataTransferItemList created by an onDrop event.
 * @param {itemsFn} itemsFn - The callback the list of dropped items are passed to.
 */
const processDroppedFiles = async (transferItemList, itemsFn) => {
    // TransferItemLists aren't actually arrays/lists in JS-land.
    let allItems = convertDTIL(transferItemList);

    // Get all of the files split out into their own list.
    let fileItems = allItems
        .filter((i) => i.kind === "file")
        .map((i) => i.getAsFile())
        .filter((f) => f.size > 0) // filter out 0-byte files and directories.
        .map((i) => ({ kind: KindFile, value: i }));

    // Clear out any nulls from the list. Yes, they do actually creep in and
    // this really is necessary.
    fileItems = fileItems.filter((i) => i !== null && i !== "undefined");

    // Set the new value of uploadItems, which should trigger a re-render.
    return itemsFn(fileItems);
};

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
    const { itemsFn } = props;

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
        processDroppedFiles(event.dataTransfer.items, itemsFn);
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

const getURLs = (str) => str.match(/(https?:\/\/[^ \\(\\)]*)/g);

const validURL = (possibleURL) => {
    const matches = getURLs(possibleURL);
    if (matches && matches.length > 0) {
        return true;
    }
    return false;
};

export const URLImportTextField = (props) => {
    const classes = useStyles();
    const [uploadURL, setUploadURL] = useState("");
    const [isValidURL, setIsValidURL] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const { addURLFn } = props;

    const clickHandler = (event) => {
        setupEvent(event);
        addURLFn(event, uploadURL);
        setUploadURL("");
        setIsValidURL(false);
    };

    return (
        <div className={classes.textFieldContainer}>
            <TextField
                fullWidth
                id="url-text-field"
                placeholder="http://..."
                helperText="Enter the URL here and either hit Enter or click on the Import button."
                InputLabelProps={{
                    shrink: true,
                }}
                className={classes.textField}
                error={!isValidURL && isFocus}
                value={uploadURL}
                onFocus={(e) => setIsFocus(true)}
                onBlur={(e) => setIsFocus(false)}
                onChange={(e) => {
                    setupEvent(e);

                    const possibleUploadURL = e.target.value.trim();

                    if (!validURL(possibleUploadURL)) {
                        setIsValidURL(false);
                    } else {
                        setIsValidURL(true);
                    }

                    setUploadURL(possibleUploadURL);
                }}
                onKeyPress={(e) => {
                    if (e.key === "Enter" && isValidURL) {
                        setupEvent(e);
                        clickHandler(e);
                    }
                }}
            />
            <IconButton
                aria-label="import-file-from-url"
                disabled={!isValidURL}
                onClick={(e) => {
                    setupEvent(e);
                    clickHandler(e);
                }}
                color="primary"
                edge="end"
            >
                <UploadIcon />
            </IconButton>
        </div>
    );
};

export const URLImportDialog = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const classes = useStyles();
    const { addURLFn } = props;

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="url-import-dialog"
        >
            <DialogTitle>Import file from URL</DialogTitle>

            <DialogContent>
                <URLImportTextField addURLFn={addURLFn} />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} className={classes.dialogClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default URLImportDialog;
