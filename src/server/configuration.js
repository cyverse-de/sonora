import config from "config";

if (!config.has("terrain_url")) {
    throw Error("terrain_url must be set in the configuration.");
}

export const terrainURL = config.get("terrain_url");
export const isDevelopment = process.env.NODE_ENV !== "production";
export const listenPort = parseInt(process.env.PORT || "3000", 10);
