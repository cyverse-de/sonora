import { ERROR, SUCCESS } from "components/announcer/AnnouncerConstants";
import { announce } from "components/announcer/CyVerseAnnouncer";
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
