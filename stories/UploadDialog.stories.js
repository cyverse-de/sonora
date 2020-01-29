import React from "react";
import { storiesOf } from "@storybook/react";
import UploadDialog from "../src/components/UploadDialog";

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
