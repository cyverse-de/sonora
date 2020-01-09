import { RESTDataSource } from "apollo-datasource-rest";
import { terrainURL } from "../../configuration";

export default class TerrainDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = terrainURL;
    }

    async getStatus() {
        return await this.get("/");
    }

    async getNewUUID() {
        return await this.get("/uuid");
    }
}
