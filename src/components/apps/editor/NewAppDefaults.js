/**
 * A model template for creating new apps,
 * with default properties for the App Editor form.
 *
 * @author psarando
 */
import systemId from "components/models/systemId";

const NewAppDefaults = {
    system_id: systemId.de,
    name: "",
    description: "",
    groups: [],
    tools: [],
};

export default NewAppDefaults;
