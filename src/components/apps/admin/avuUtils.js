export const BETA_ATTR = "n2t.net/ark:/99152/h1459";
export const BLESSED_ATTR = "cyverse-blessed";

export const betaAVU = {
    attr: BETA_ATTR,
    value: "beta",
    unit: "",
    avus: [{ attr: "rdfs:label", value: "releaseStatus", unit: "attr" }],
};

export const blessedAVU = {
    attr: BLESSED_ATTR,
    value: "true",
    unit: "",
};

export const removeAVUs = (appAVUs, attrToRemove) => {
    if (appAVUs?.length > 0 && attrToRemove) {
        return appAVUs.filter((avu) => attrToRemove !== avu.attr);
    }
    return appAVUs;
};
