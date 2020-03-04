import { ONE_GB } from "../constants";

export default {
    description:
        "Launches a Jupyter Lab with ScyPy \n\nMaintained here: https://github.com/cyverse-vice/jupyterlab-scipy ",
    requirements: [
        {
            step_number: 0,
            max_cpu_cores: 16,
            memory_limit: 64 * ONE_GB,
            default_cpu_cores: 8,
            default_memory: 32 * ONE_GB,
            default_disk_space: 128 * ONE_GB,
        },
    ],
    deleted: false,
    disabled: false,
    name: "Jupyter Lab no params",
    system_id: "de",
    label: "Jupyter Lab no params",
    id: "4dcda8a6-5761-11ea-bd06-008cfa5ae621",
    app_type: "DE",
    groups: [],
};
