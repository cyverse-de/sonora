import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const NavigationTabPanel = ({ children, value, index, ...other }) => (
    <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`navigation-tabpanel-${index}`}
        aria-labelledby={`navigation-tabpanel-${index}`}
        {...other}
    >
        {value === index && <Box>{children}</Box>}
    </Typography>
);

NavigationTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const a11yProps = (index) => ({
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
}));

const NavigationTabBar = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { dashboard, data, apps, analyses, tools, community, alerts } = props;

    return (
        <div className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="on"
                aria-label="scrollable auto tabs"
            >
                <Tab label="Dashboard" {...a11yProps(0)}></Tab>
                <Tab label="Data" {...a11yProps(1)}></Tab>
                <Tab label="Apps" {...a11yProps(2)}></Tab>
                <Tab label="Analyses" {...a11yProps(3)}></Tab>
                <Tab label="Tools" {...a11yProps(4)}></Tab>
                <Tab label="Community" {...a11yProps(5)}></Tab>
                <Tab label="Alerts" {...a11yProps(6)}></Tab>
            </Tabs>
            <NavigationTabPanel value={value} index={0}>
                {dashboard()}
            </NavigationTabPanel>
            <NavigationTabPanel value={value} index={1}>
                {data()}
            </NavigationTabPanel>
            <NavigationTabPanel value={value} index={2}>
                {apps()}
            </NavigationTabPanel>
            <NavigationTabPanel value={value} index={3}>
                {analyses()}
            </NavigationTabPanel>
            <NavigationTabPanel value={value} index={4}>
                {tools()}
            </NavigationTabPanel>
            <NavigationTabPanel value={value} index={5}>
                {community()}
            </NavigationTabPanel>
            <NavigationTabPanel value={value} index={6}>
                {alerts()}
            </NavigationTabPanel>
        </div>
    );
};

export default NavigationTabBar;
