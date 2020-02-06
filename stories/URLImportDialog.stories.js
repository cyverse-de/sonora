import React from "react";
import { storiesOf } from "@storybook/react";
import {
    UploadCard,
    URLImportTextField,
    URLImportDialog,
} from "../src/components/URLImportDialog";

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
