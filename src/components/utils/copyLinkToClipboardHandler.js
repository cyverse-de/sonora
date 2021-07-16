import {
    announce,
    ERROR,
    SUCCESS,
} from "components/announcer/CyVerseAnnouncer";
const copyLinkToClipboardHandler = (t, promise) => {
    promise.then(
        () => {
            announce({
                text: t("linkCopied"),
                variant: SUCCESS,
            });
        },
        () => {
            announce({
                text: t("linkCopyFailed"),
                variant: ERROR,
            });
        }
    );
};
export { copyLinkToClipboardHandler };
