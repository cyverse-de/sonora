/**
 * A model template for creating new apps,
 * with default properties for the App Editor form.
 *
 * @author psarando
 */
import systemId from "components/models/systemId";

export default {
    system_id: systemId.de,
    name: "",
    description: "",
    groups: [],
    tools: [],
};
