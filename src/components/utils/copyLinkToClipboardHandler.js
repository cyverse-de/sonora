import { AnnouncerConstants, announce } from "@cyverse-de/ui-lib";
const copyLinkToClipboardHandler = (t, promise) => {
    promise.then(
        () => {
            announce({
                text: t("linkCopied"),
                variant: AnnouncerConstants.SUCCESS,
            });
        },
        () => {
            announce({
                text: t("linkCopyFailed"),
                variant: AnnouncerConstants.ERROR,
            });
        }
    );
};
export { copyLinkToClipboardHandler };
