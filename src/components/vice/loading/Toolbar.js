/**
 * @author aramsey
 *
 * The toolbar displayed in the vice loading page.
 *
 * Contains buttons to show more details about the status of the VICE
 * instance and a button to contact support with those same details.
 */
import React, { useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, Drawer, makeStyles, Toolbar } from "@material-ui/core";
import { BugReport, Info } from "@material-ui/icons";

import ContactSupportDialog from "./ContactSupportDialog";
import DetailsContent from "./DetailsContent";
import { useTranslation } from "i18n";
import ids from "./ids";
import styles from "./styles";

const useStyles = makeStyles(styles);

function ViceLoadingToolbar(props) {
    const {
        parentId,
        deployments,
        configMaps,
        services,
        ingresses,
        pods,
    } = props;
    const { t } = useTranslation("vice-loading");
    const classes = useStyles();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [contactSupportDlgOpen, setContactSupportDlgOpen] = useState(false);

    const handleClose = () => setDrawerOpen(false);
    const handleClick = () => setDrawerOpen(!drawerOpen);
    const onContactSupport = () => setContactSupportDlgOpen(true);
    const onCloseContactSupport = () => setContactSupportDlgOpen(false);

    const toolbarId = build(parentId, ids.TOOLBAR);

    return (
        <>
            <Toolbar id={toolbarId} variant="dense">
                <Button
                    id={build(toolbarId, ids.REPORT_PROBLEM_BTN)}
                    variant="outlined"
                    color="primary"
                    startIcon={<BugReport />}
                    onClick={onContactSupport}
                >
                    {t("reportProblemBtn")}
                </Button>
                <div className={classes.divider} />
                <Button
                    id={build(toolbarId, ids.DETAILS_BTN)}
                    variant="outlined"
                    color="primary"
                    startIcon={<Info />}
                    onClick={handleClick}
                    classes={{ root: classes.button }}
                >
                    {t("detailsBtn")}
                </Button>
            </Toolbar>

            <ContactSupportDialog
                baseId={ids.CONTACT_SUPPORT_DLG}
                open={contactSupportDlgOpen}
                onClose={onCloseContactSupport}
                deployments={deployments}
                configMaps={configMaps}
                services={services}
                ingresses={ingresses}
                pods={pods}
            />

            <Drawer
                id={build(parentId, ids.DETAILS_DRAWER)}
                anchor="right"
                open={drawerOpen}
                onClose={handleClose}
                PaperProps={{
                    classes: { root: classes.drawerPaper },
                }}
            >
                <DetailsContent
                    deployments={deployments}
                    configMaps={configMaps}
                    services={services}
                    ingresses={ingresses}
                    pods={pods}
                />
            </Drawer>
        </>
    );
}

export default ViceLoadingToolbar;
