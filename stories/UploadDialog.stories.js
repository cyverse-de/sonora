import React from "react";
import { storiesOf } from "@storybook/react";
import UploadDialog, {
    UploadCard,
    URLImportTextField,
    URLImportDialog,
} from "../src/components/UploadDialog";

storiesOf("UploadDialog", module)
    .add("basic dialog", () => (
        <UploadDialog open={true} destination="/iplant/home/ipcdev" />
    ))
    .add("with long destination", () => (
        <UploadDialog
            open={true}
            destination="/iplant/home/this/is/a/test/of/a/really/very/long/destination/directory/omg/it/keeps/going/and/going/and/it/never/ends"
        />
    ));

storiesOf("UploadCard", module).add("basic support", () => (
    <UploadCard
        dropFn={(e, items) => {
            for (let item of items) {
                console.log(`drop callback item kind '${item.kind}'`);
            }
        }}
    />
));

storiesOf("URL text field", module).add("placeholder", () => (
    <URLImportTextField />
));

storiesOf("URL Import Dialog", module).add("basic", () => (
    <URLImportDialog
        open={true}
        addURLFn={(e, url) => {
            console.log(`import URL ${url}`);
        }}
    />
));
