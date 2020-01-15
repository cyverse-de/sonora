/**
 * The Apollo GraphQL REST data source for the terrain service.
 *
 * @module
 */

import { RESTDataSource } from "apollo-datasource-rest";
import { terrainURL } from "../../configuration";
import _ from "lodash";

export const FILE = "file";
export const FOLDER = "folder";
/**
 * The data source for the terrain service.
 *
 * @extends RESTDataSource
 */
export default class TerrainDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = terrainURL;
    }

    willSendRequest(request) {
        const token = this.context?.user?.accessToken;
        if (typeof token !== "undefined") {
            request.headers.set("Authorization", `Bearer ${token}`);
        }
    }

    async getStatus() {
        return await this.get("/");
    }

    async getNewUUID() {
        return await this.get("/uuid");
    }

    /**
     * Returns info about a file or folder from terrain.
     * @param {string} fullPath - The full path to the file in the data store.
     * @returns {(File | Folder)}
     */
    async filesystemStat(fullPaths) {
        let retval = await this.post("/secured/filesystem/stat", {
            paths: fullPaths,
        });
        return _.values(retval.paths);
    }

    /**
     * Returns a folder listing.
     * @param {string} path - The full path to the folder being listed.
     * @param {number} limit - The maximum number of items included in the response.
     * @param {number} offset - The number of items to skip over before starting the list.
     * @param {string} entityType - The type of items included in the results. Should be one of FILE, FOLDER, or ANY.
     * @param {string} sortColumn - The column to sort on. One of NAME, ID, LASTMODIFIED, DATECREATED, SIZE, or PATH.
     * @param {string} sortDirection - One of "ASC" (for ascending order) or "DESC" (for descending order).
     * @returns {Array<{(File | Folder)}>}
     */
    async listFolder(
        path,
        limit,
        offset,
        entityType,
        sortColumn,
        sortDirection
    ) {
        let pathParam = `path=${path}`;
        let limitParam = `limit=${limit}`;
        let offsetParam = `offset=${offset}`;
        let entityTypeParam = `entity-type=${entityType}`;
        let sortColumnParam = `sort-col=${sortColumn}`;
        let sortDirectionParam = `sort-dir=${sortDirection}`;

        let responseValue = await this.get(
            `/secured/filesystem/paged-directory?${pathParam}&${limitParam}&${offsetParam}&${entityTypeParam}&${sortColumnParam}&${sortDirectionParam}`
        );

        // The page-directory endpoint doesn't include a type field for the
        // folder being listed (because you should already know), but for
        // consistency we'll include it here.
        let retval = {
            stat: _.set(
                _.omit(responseValue, ["files", "folders"]), // unify the listing.
                "type",
                "folder"
            ),
        };

        // Unlike the stat endpoint, the page-directory call doesn't include
        // the type field, so we add it in here for consistency.
        retval.listing = _.map(responseValue.folders, (f) => {
            f.type = FOLDER;
            return f;
        });
        retval.listing.concat(
            _.map(responseValue.files, (f) => {
                f.type = FILE;
                return f;
            })
        );

        return retval;
    }
}
