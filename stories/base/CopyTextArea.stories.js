/**
 * @author psarando
 */

import React from "react";
import CopyTextArea from "components/copy/CopyTextArea";

export function CopyTextAreaTest() {
    let textToCopy = `The Dark Arts better be worried,
oh boy!`;

    return (
        <CopyTextArea
            debugIdPrefix="test.id.prefix"
            btnText="Copy"
            copiedBtnText="Copied!"
            multiline={true}
            text={textToCopy}
        />
    );
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: "base/CopyTextArea",
};
