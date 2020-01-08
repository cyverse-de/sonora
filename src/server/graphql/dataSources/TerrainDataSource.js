import { RestDataSource, RESTDataSource } from "apollo-datasource-rest";
import _ from "lodash";

export default class TerrainDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = process.env.TERRAIN_URL;
    }

    async getStatus() {
        return await this.get("/");
    }

    async getNewUUID() {
        return await this.get("/uuid");
    }
}
