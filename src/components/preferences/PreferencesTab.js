import React from "react";
import styles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(styles);

export default function PreferencesTab() {
    const classes = useStyles();

    const [state, setState] = React.useState({
        //TODO load default preferences
        //TODO rename these?
        checkedA: true,
        checkedB: true,
        checkedC: false,
        checkedD: true,
        checkedE: true,
        checkedF: true,
    });

    const handleSwitchChange = (name) => (event) => {
        setState({ ...state, [name]: event.target.checked });
    };

    //TODO add on change function for each switch that sends API request to change preference
    //TODO make headers look more like headers
    return (
        <div className={classes.preferences}>
            <Typography className={classes.sectionHeader}>General</Typography>
            <br />
            Remember last file path for Apps
            <Switch
                checked={state.checkedA}
                onChange={handleSwitchChange("checkedA")}
                value="checkedA"
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Save Session
            <Switch
                checked={state.checkedB}
                onChange={handleSwitchChange("checkedB")}
                value="checkedB"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Prompt for HPC apps authentication after log-on,
            <Switch
                checked={state.checkedC}
                onChange={handleSwitchChange("checkedC")}
                value="checkedC"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            or when apps window is opened
            <br />
            <br />
            Display Warning about wait times for submitting HPC apps
            <Switch
                checked={state.checkedD}
                onChange={handleSwitchChange("checkedD")}
                value="checkedD"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            <Divider className={classes.dividers} />
            <Typography className={classes.sectionHeader}>
                Default analysis output folder
            </Typography>
            <br />
            {/* TODO make default text the path with the user's name in it */}
            <TextField
                className={classes.textField}
                label="Path"
                defaultValue="/iplant/home/mgwall/analyses"
                variant="outlined"
            />
            <Button color="primary" className={classes.actionButton}>
                BROWSE
            </Button>
            <br />
            <br />
            <Divider className={classes.dividers} />
            <Typography className={classes.sectionHeader}>
                Email Notifications
            </Typography>
            <br />
            Email me when my analysis status changes
            <Switch
                checked={state.checkedE}
                onChange={handleSwitchChange("checkedE")}
                value="checkedE"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Email me when my URL import status changes
            <Switch
                checked={state.checkedF}
                onChange={handleSwitchChange("checkedF")}
                value="checkedF"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
        </div>
    );
}
