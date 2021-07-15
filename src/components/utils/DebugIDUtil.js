/**
 @author sriram, psarando
 */
export default function buildID(...ids) {
    const DOT = ".";

    return ids.join(DOT);
}
