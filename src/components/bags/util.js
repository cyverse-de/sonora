import { createNewBagItem } from "./classes";
const formatBagItems = (data) => {
    let converted = [];

    if (data?.contents?.items) {
        converted = data.contents.items.map((item) => createNewBagItem(item));
    }

    return converted;
};

export { formatBagItems };
