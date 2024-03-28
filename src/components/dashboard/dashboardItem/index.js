import * as constants from "../constants";

import AppItem from "./AppItem";
import AnalysisItem from "./AnalysisItem";
import NewsItem from "./NewsItem";
import VideoItem from "./VideoItem";
import EventItem from "./EventItem";
import InstantLaunchItem from "./InstantLaunchItems";

const dashboardItem = (props) => {
    switch (props.kind) {
        case constants.KIND_ANALYSES:
            return AnalysisItem.create(props);
        case constants.KIND_APPS:
            return AppItem.create(props);
        case constants.KIND_EVENTS:
            return new EventItem(props);
        case constants.KIND_INSTANT_LAUNCHES:
            return InstantLaunchItem.create(props);
        default:
            if (props.section === constants.SECTION_VIDEOS) {
                return new VideoItem(props);
            }
            return new NewsItem(props);
    }
};

export default dashboardItem;
