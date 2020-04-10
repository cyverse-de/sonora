import logger from "../logging";
import {getUserID} from "../auth";

export default function websocketHandler(ws, req) {
    ws.on('message', function(msg) {
        logger.info("new msg received ==>" + msg + " userId=>" + getUserID(req));
    });

}