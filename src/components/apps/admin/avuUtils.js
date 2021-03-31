export const BETA_ATTR = "n2t.net/ark:/99152/h1459";
export const BLESSED_ATTR = "cyverse-blessed";

export const betaAVU = {
    attr: BETA_ATTR,
    value: "beta",
    unit: "",
    avus: [{ attr: "rdfs:label", value: "releaseStatus", unit: "attr" }],
};

export const removeBetaAVU = (appAVUs) => {
    if (appAVUs && appAVUs.length > 0) {
        const updatedAVUs = appAVUs.filter((avu) => avu.attr !== BETA_ATTR);
        return updatedAVUs;
    }
    return appAVUs;
};

export const findBlessedAVU = (appAVUs) => {
    let blessedAVU = null;
    if (appAVUs && appAVUs.length > 0) {
        blessedAVU = appAVUs.find((avu) => avu.attr === BLESSED_ATTR);
    }
    return blessedAVU;
};

export const blessedAVU = {
    attr: BLESSED_ATTR,
    value: "true",
    unit: "",
};

export const removeAVUs = (appAVUs, attrsToRemove) => {
    if (appAVUs?.length > 0 && attrsToRemove?.length > 0) {
        return appAVUs.filter((avu) => {
            if (attrsToRemove.indexOf(avu.attr) === -1) {
                return true;
            } else {
                return false;
            }
        });
    }
    return appAVUs;
};
