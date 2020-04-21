/**
 * @author sriram
 *
 * A component that displays formatted error message with options to contact support or login
 */
import React from "react";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Typography,
    Link,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import ErrorIcon from "@material-ui/icons/Error";
import { useRouter } from "next/router";
import NavigationConstants from "../../common/NavigationConstants";
import GridLabelValue from "./GridLabelValue";
import { useUserProfile } from "../../contexts/userProfile";

export default function ErrorHandler(props) {
    const { errorObject } = props;
    const [userProfile] = useUserProfile();
    const router = useRouter();
    if (!errorObject) {
        return null;
    }
    console.log("error=>" + JSON.stringify(errorObject));
    const errorResponse = errorObject.response;
    console.log("response=>" + JSON.stringify(errorResponse));
    if (errorResponse) {
        if (errorResponse?.status === 401) {
            return (
                <Card>
                    <CardHeader
                        title={
                            <Typography color="primary" variant="h6">
                                Discovery Environment - Sign in required!
                            </Typography>
                        }
                    />
                    <Divider oritentation="horizontal" />
                    <CardContent>
                        <Typography>
                            Please login to continue or sign-up for an account!
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            color="secondary"
                            onClick={() => {
                                window.open(
                                    "https://user.cyverse.org/register"
                                );
                            }}
                        >
                            Sign up for an account.
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AccountCircle />}
                            onClick={() => {
                                router.push(
                                    `/${NavigationConstants.LOGIN}${router.asPath}`
                                );
                            }}
                        >
                            Login
                        </Button>
                    </CardActions>
                </Card>
            );
        } else {
            return (
                <Card>
                    <CardHeader
                        title={
                            <Typography color="error" variant="h6">
                                Error
                            </Typography>
                        }
                        subheader={
                            <Typography color="error" variant="subtitle2">
                                {errorObject.message}
                            </Typography>
                        }
                    />
                    <Divider oritentation="horizontal" />
                    <CardContent style={{ margin: 3 }}>
                        <Grid container spacing={3} style={{ margin: 3 }}>
                            <GridLabelValue label="Requested URL">
                                {errorObject.config?.url}
                            </GridLabelValue>
                            <GridLabelValue label="Status Code">
                                {errorResponse?.status}
                            </GridLabelValue>
                            <GridLabelValue label="Error Code">
                                {errorResponse?.data?.error_code}
                            </GridLabelValue>
                            <GridLabelValue label="Reason">
                                {JSON.stringify(errorResponse?.data?.reason)}
                            </GridLabelValue>
                            <GridLabelValue label="User">
                                {userProfile?.id}
                            </GridLabelValue>
                        </Grid>
                    </CardContent>
                    <Divider oritentation="horizontal" />
                    <CardActions>
                        <Button
                            color="primary"
                            startIcon={<LiveHelpIcon />}
                            onClick={() => window.Intercom("show")}
                        >
                            Contact Support
                        </Button>
                    </CardActions>
                </Card>
            );
        }
    } else {
        return (
            <Typography color="error">
                Oops! This wasn't supposed to happen. Please try again or
                <Link onClick={() => window.Intercom("show")}>
                    contact support
                </Link>
            </Typography>
        );
    }
}
