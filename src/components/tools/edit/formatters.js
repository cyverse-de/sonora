/**
 * Formatting and init functions for Tool Edit forms.
 *
 * @author psarando
 */
import TOOL_TYPES from "components/models/ToolTypes";

/**
 * @typedef {object} Tool
 * @property {object} implementation
 * @property {object} container
 * @property {object} container.image
 * @property {object[]} container.container_ports
 * @property {object[]} container.container_devices
 * @property {object[]} container.container_volumes
 * @property {object[]} container.container_volumes_from
 */

/**
 * Initializes the form values from the given Tool,
 * or with empty default values for adding a new Tool if `tool` is null.
 *
 * Additional form field values are returned if `isAdmin` is `true`.
 *
 * @param {Tool} tool
 * @param {boolean} isAdmin
 *
 * @returns Initial form values.
 */
export function mapPropsToValues(tool, isAdmin) {
    // Init the default values for form fields a normal user can view or edit.
    let values = {
        name: "",
        description: "",
        version: "",
        type: "",
        time_limit_seconds: "",
        container: {
            image: {
                name: "",
                url: "",
                tag: "",
                osg_image_path: "",
            },
            entrypoint: "",
            working_directory: "",
            uid: "",
            max_cpu_cores: "",
            memory_limit: "",
            min_disk_space: "",
            pids_limit: "",
            network_mode: "",
            container_ports: [],
        },
    };

    if (isAdmin) {
        // Add default values for the form fields an admin can edit.
        values = {
            ...values,
            attribution: "",
            location: "",
            restricted: false,
            container: {
                ...values.container,
                name: "",
                min_cpu_cores: "",
                min_memory_limit: "",
                cpu_shares: "",
                container_devices: [],
                container_volumes: [],
                container_volumes_from: [],
            },
            implementation: {
                implementor: "",
                implementor_email: "",
                test: {
                    input_files: [],
                    output_files: [],
                },
            },
        };
    }

    if (tool) {
        // Copy existing tool fields over default values.
        const {
            id,
            name,
            description,
            version,
            type,
            time_limit_seconds,
            attribution,
            location,
            restricted,
            container,
            implementation,
        } = tool;

        values = {
            ...values,
            id,
            name,
            description,
            version,
            type,
            time_limit_seconds,
            container: {
                ...values.container,
                ...container,
            },
        };

        const {
            image,
            container_ports,
            container_devices,
            container_volumes,
            container_volumes_from,
        } = container;

        const { tag, url, osg_image_path } = image;

        // Ensure optional tool fields are set with an empty string, if missing.
        values.container.image = {
            name: image.name,
            tag: tag || "",
            url: url || "",
            osg_image_path: osg_image_path || "",
        };

        if (container_ports) {
            values.container.container_ports = container_ports.map(
                ({ container_port }) => ({ container_port })
            );
        }

        if (isAdmin) {
            values = {
                ...values,
                attribution: attribution || "",
                location: location || "",
                restricted,
            };

            values.implementation = {
                ...implementation,
                test: {
                    input_files: [...implementation.test.input_files],
                    output_files: [...implementation.test.output_files],
                },
            };

            if (container_ports) {
                values.container.container_ports = container_ports.map(
                    ({ container_port, host_port, bind_to_host }) => ({
                        container_port,
                        host_port: host_port || "",
                        bind_to_host,
                    })
                );
            }

            if (container_devices) {
                values.container.container_devices = container_devices.map(
                    ({ container_path, host_path }) => ({
                        container_path,
                        host_path,
                    })
                );
            }
            // container: container_volumnes = []
            if (container_volumes) {
                values.container.container_volumes = container_volumes.map(
                    ({ container_path, host_path }) => ({
                        container_path,
                        host_path,
                    })
                );
            }

            if (container_volumes_from) {
                values.container.container_volumes_from =
                    container_volumes_from.map(
                        ({ name, name_prefix, tag, url, read_only }) => ({
                            name,
                            name_prefix,
                            tag: tag || "",
                            url: url || "",
                            read_only,
                        })
                    );
            }
        }
    }

    return values;
}

/**
 * Formats the form values for submission to the service.
 *
 * @param {Tool} values
 * @param {Object} config
 * @param {Object} config.vice
 * @param {string} config.vice.defaultCasUrl
 * @param {string} config.vice.defaultName
 * @param {string} config.vice.defaultImage
 * @param {string} config.vice.defaultCasValidate
 * @param {boolean} isAdmin
 *
 * @returns The Tool formatted for submission to the service.
 */
export function formatSubmission(values, config, isAdmin) {
    const {
        id,
        name,
        version,
        attribution,
        description,
        type,
        location,
        restricted,
        time_limit_seconds,
        container,
        implementation,
    } = values;

    const submission = {
        id,
        name,
        description,
        version,
        type,
        interactive: type === TOOL_TYPES.INTERACTIVE,
    };

    const {
        name: containerName,
        entrypoint,
        working_directory,
        uid,
        min_cpu_cores,
        min_memory_limit,
        cpu_shares,
        max_cpu_cores,
        memory_limit,
        min_disk_space,
        pids_limit,
        container_ports,
        container_devices,
        container_volumes,
        container_volumes_from,
    } = container;

    // An undefined value means that key won't be submitted in the request,
    // and container settings will be removed if its key is not included in the
    // tool update request.
    submission.container = {
        ...container,
        entrypoint: entrypoint || undefined,
        working_directory: working_directory || undefined,
        uid: uid || undefined,
        max_cpu_cores: max_cpu_cores || undefined,
        memory_limit: memory_limit || undefined,
        min_disk_space: min_disk_space || undefined,
        pids_limit: pids_limit || undefined,
        skip_tmp_mount: false,
        interactive_apps: undefined,
        container_ports: undefined,
        container_devices: undefined,
        container_volumes: undefined,
        container_volumes_from: undefined,
    };

    if (isAdmin) {
        submission.restricted = restricted;
        submission.time_limit_seconds = time_limit_seconds || 0;
        submission.location = location;
        submission.attribution = attribution;
        submission.implementation = implementation;

        submission.container = {
            ...submission.container,
            name: containerName || undefined,
            min_cpu_cores: min_cpu_cores || undefined,
            min_memory_limit: min_memory_limit || undefined,
            cpu_shares: cpu_shares || undefined,
            container_devices: container_devices,
            container_volumes: container_volumes,
            container_volumes_from: container_volumes_from,
        };
    }

    // These keys need to be added for interactive tools.
    if (submission.interactive) {
        const interactive_apps = {
            cas_url: config.vice.defaultCasUrl,
            name: config.vice.defaultName,
            image: config.vice.defaultImage,
            cas_validate: config.vice.defaultCasValidate,
        };

        submission.container.interactive_apps = interactive_apps;
        submission.container.skip_tmp_mount = true;

        submission.container.container_ports = container_ports.map(
            ({ container_port, host_port, bind_to_host }) => {
                const portConfig = {
                    container_port,
                    bind_to_host,
                };

                // Don't include empty host ports.
                if (host_port) {
                    portConfig.host_port = host_port;
                }

                return portConfig;
            }
        );
    }

    return submission;
}
