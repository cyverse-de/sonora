// QUERY BUILDING BLOCKS
const ALL = "all";
const ANY = "any";
const NONE = "none";

const TYPE = "type";
const ARGS = "args";
const QUERY = "query";

const NEGATED = "negated";

const GROUPS = [ALL, ANY, NONE];

const isNegated = (query) => {
    const negated = NEGATED in query;
    console.log("isNegated=>" + negated);
    if (negated) {
        return query.negated;
    } else {
        return false;
    }
};

const getArgs = (query) => {
    //console.log("getArgs=>" + JSON.stringify(query[ARGS]));
    return query[ARGS];
};

const isGroup = (query) => {
    const type = getTypeValue(query);
    //console.log("isGroup=>" + JSON.stringify(type));
    return GROUPS.includes(type);
};

const getTypeValue = (query) => {
    //console.log("getTypeValue=>" + JSON.stringify(query[TYPE]));
    return query[TYPE];
};

const build = (query, subQuery) => {
    const noneList = [];
    //console.log("query=>" + JSON.stringify(query));
    //console.log("subQuery=>" + JSON.stringify(subQuery));
    if (isGroup(subQuery)) {
        const type = getTypeValue(subQuery);
        const group = {};
        const arrayArgs = getArgs(subQuery);
        if (arrayArgs?.length > 0) {
            const newArrayArgs = [];
            group[type] = newArrayArgs;
            arrayArgs.forEach((arg) => {
                build(newArrayArgs, arg);
            });
            subQuery = group;
            if (Array.isArray(query)) {
                query.splice(query.length, 0, subQuery);
            } else {
                query[QUERY] = subQuery;
            }
        }
    } else {
        const type = getTypeValue(subQuery);
        if (!type) {
            return;
        }
        const negated = isNegated(getArgs(subQuery));
        if (negated) {
            const noneNamed = {};
            noneNamed[NONE] = noneList;
            noneList.splice(noneList.length, 0, subQuery);
            query.splice(query.length, 0, noneNamed);
        } else {
            query.splice(query.length, 0, subQuery);
        }
    }
   // console.log("Query inside=>" + JSON.stringify(query));
};

export const simpleQueryTemplate = (searchTerm) => ({
    type: "all",
    args: [
        {
            type: "path",
            args: {
                negated: true,
                prefix: "/iplant/home/shared",
            },
        },
        {
            type: "label",
            args: {
                exact: false,
                negated: false,
                label: searchTerm,
            },
        },
    ],
});

export const buildQuery = (template) => {
    const query = {};
    build(query, template);
  //  console.log("Query is => " + JSON.stringify(query));
    return query;
};
