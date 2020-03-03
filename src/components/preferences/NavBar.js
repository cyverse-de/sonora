import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import styles from "./styles";
import PreferencesTab from "./PreferencesTab";
import ShortcutsTab from "./ShortcutsTab";
import { DialogActions } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Formik, Form } from "formik";
import WebhooksTab from "./WebhooksTab";
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(styles);

export default function FullWidthTabs(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const { config } = props;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleSubmit = (values, actions) => {
        actions.setSubmitting = true;
        console.log(values);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Preferences" {...a11yProps(0)} />
                    <Tab label="Shortcuts" {...a11yProps(1)} />
                    <Tab label="Webhooks" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <Formik initialValues={config} onSubmit={handleSubmit}>
                <Form>
                    <SwipeableViews
                        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <PreferencesTab config={props} />
                            {/* TODO preferences element */}
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            {/* TODO shortcuts element */}
                            <ShortcutsTab />
                        </TabPanel>
                        <TabPanel value={value} index={2} dir={theme.direction}>
                            <WebhooksTab />
                        </TabPanel>
                    </SwipeableViews>
                    <DialogActions>
                        <Button
                            className={classes.actionButton}
                            color="primary"
                        >
                            RESTORE DEFAULTS
                        </Button>
                        <Button
                            className={classes.actionButton}
                            color="primary"
                            type="submit"
                        >
                            SAVE
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>
        </div>
    );
}
