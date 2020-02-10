import React from "react";
import { storiesOf } from "@storybook/react";
import URLImportDialog, {
    UploadCard,
    URLImportTextFieldI18N,
} from "../src/components/URLImportDialog";

import Snackbar from "@material-ui/core/Snackbar";

storiesOf("UploadCard", module).add("basic support", () => (
    <UploadCard
        itemsFn={(items) => {
            for (let item of items) {
                console.log(`drop callback item name '${item.value.name}'`);
            }
        }}
    />
));

storiesOf("URL text field", module).add("placeholder", () => (
    <URLImportTextFieldI18N />
));

storiesOf("URL Import Dialog", module).add("basic", () => {
    const [msg, setMsg] = React.useState("");
    const [snackOpen, setSnackOpen] = React.useState(false);

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                autoHideDuration={4000}
                open={snackOpen}
                message={msg}
                onClose={(e) => setSnackOpen(false)}
            />

            <URLImportDialog
                open={true}
                addURLFn={(e, url) => {
                    setMsg(
                        `URL import of ${url}. This is from the story and not from the dialog component.`
                    );
                    setSnackOpen(true);
                }}
            />
        </div>
    );
});
