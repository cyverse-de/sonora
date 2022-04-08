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
    const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

    const endpoint = process.env.OTEL_EXPORTER_JAEGER_ENDPOINT;

    if (endpoint === "") {
        console.log(
            "No Jaeger endpoint specified, but trace exporter is set to Jaeger"
        );
    }

    const options = {
        endpoint: endpoint,
    };

    const sdk = new opentelemetry.NodeSDK({
        traceExporter: new JaegerExporter(options),
        instrumentations: [getNodeAutoInstrumentations()],
        resource: resource,
    });

    sdk.start();
}
