import React, { Component } from "react";
import AppTile from "../../src/components/apps/tile/AppTile";
import Grid from "@material-ui/core/Grid";
import { appListing } from "./AppMocks";

class AppTileTest extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const onChange = (event, value) => console.log("new rating:" + value);
        return (
            <Grid container style={{ flexGrow: 1 }} spacing={1}>
                {appListing.apps.map((app) => (
                    <Grid key={app.id} item>
                        <AppTile
                            uuid={app.id}
                            name={app.name}
                            creator={app.integrator_name}
                            rating={app.rating}
                            type={app.app_type}
                            isPublic={app.is_public}
                            isBeta={app.beta}
                            isDisabled={app.disabled}
                            isBlessed={app.isBlessed}
                            isExternal={app.app_type !== "DE"}
                            isFavorite={app.is_favorite}
                            onAppInfoClick={() =>
                                console.log("App info clicked!")
                            }
                            onCommentsClick={() =>
                                console.log("Comments clicked!")
                            }
                            onFavoriteClick={() =>
                                console.log("Favorite clicked!")
                            }
                            onRatingChange={onChange}
                            onDeleteRatingClick={() =>
                                console.log("Delete rating selected!")
                            }
                            searchRegexPattern=""
                            baseDebugId="appListing"
                            onAppSelected={() => console.log("App selected!")}
                            onAppNameClick={() =>
                                console.log("App name clicked!")
                            }
                            searchTerm="Bowtie"
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default { title: "Apps / Tiles" };

export const AppTiles = () => <AppTileTest />;
