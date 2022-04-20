const opentelemetry = require("@opentelemetry/sdk-node");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const traceExporter = process.env.OTEL_TRACES_EXPORTER;

const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "sonora",
});

const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { PgInstrumentation } = require("@opentelemetry/instrumentation-pg");
const {
    AmqplibInstrumentation,
} = require("@opentelemetry/instrumentation-amqplib");
const {
    ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");

function getInstrumentations() {
    return [
        new HttpInstrumentation(),
        new ExpressInstrumentation({ ignoreLayersType: ["middleware"] }),
        new PgInstrumentation(),
        new AmqplibInstrumentation(),
    ];
}

if (traceExporter === "console") {
    const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");
    const sdk = new opentelemetry.NodeSDK({
        traceExporter: new ConsoleSpanExporter(),
        instrumentations: [getInstrumentations()],
        resource: resource,
    });

    console.log("starting sdk");
    sdk.start()
        .then(() => console.log("Tracing initialized"))
        .catch((error) => console.log("Error initializing tracing", error));

    process.on("SIGTERM", () => {
        sdk.shutdown()
            .then(() => console.log("Tracing terminated"))
            .catch((error) => console.log("Error terminating tracing", error))
            .finally(() => process.exit(0));
    });
} else if (traceExporter === "jaeger") {
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
        instrumentations: [getInstrumentations()],
        resource: resource,
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
