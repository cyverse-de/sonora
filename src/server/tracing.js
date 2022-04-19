const opentelemetry = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const traceExporter = process.env.OTEL_TRACES_EXPORTER;

const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "sonora",
});

if (traceExporter === "jaeger") {
    console.log("Setting up a jaeger exporter");
    const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

    const endpoint = process.env.OTEL_EXPORTER_JAEGER_ENDPOINT;

    if (endpoint === "") {
        console.log(
            "No Jaeger endpoint specified, but trace exporter is set to Jaeger"
        );
    }

    console.log(`Jaeger endpoint: ${endpoint}`);

    const options = {
        endpoint: endpoint,
    };

    const sdk = new opentelemetry.NodeSDK({
        traceExporter: new JaegerExporter(options),
        instrumentations: [getNodeAutoInstrumentations()],
        resource: resource,
        autoDetectResources: false,
    });

    console.log("starting sdk");
    sdk.start()
        .then(() => console.log("Tracing initialized"))
        .catch((error) => console.log("Error initializing tracing", error));

    process.on("SIGTERM", () => {
        sdk.shutdown()
            .then(() => console.log("Tracing terminated"))
            .catch((error) => console.log("Error terminating traccing", error))
            .finally(() => process.exit(0));
    });
}
