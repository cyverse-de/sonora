import { RESTDataSource } from "apollo-datasource-rest";
import { terrainURL } from "../../configuration";

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
}
