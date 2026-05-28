import {
    formatSubmission,
    mapPropsToValues,
} from "components/tools/edit/formatters";

describe("tools edit formatters GPU fields", () => {
    test("mapPropsToValues initializes GPU fields for non-admin tool editing", () => {
        const values = mapPropsToValues(null, false);

        expect(values.container.min_gpus).toBe("");
        expect(values.container.max_gpus).toBe("");
        expect(values.container.gpu_models).toEqual([]);
    });

    test("formatSubmission includes GPU fields for non-admin tool editing", () => {
        const submission = formatSubmission(
            {
                name: "Tool",
                description: "Desc",
                version: "1.0",
                type: "executable",
                container: {
                    image: { name: "image-name" },
                    entrypoint: "",
                    working_directory: "",
                    uid: "",
                    min_gpus: 1,
                    max_gpus: 2,
                    max_cpu_cores: "",
                    memory_limit: "",
                    min_disk_space: "",
                    pids_limit: "",
                    network_mode: "",
                    gpu_models: ["A100"],
                    container_ports: [],
                    container_devices: [],
                    container_volumes: [],
                    container_volumes_from: [],
                },
            },
            { vice: {} },
            false
        );

        expect(submission.container.min_gpus).toBe(1);
        expect(submission.container.max_gpus).toBe(2);
        expect(submission.container.gpu_models).toEqual(["A100"]);
    });
});
