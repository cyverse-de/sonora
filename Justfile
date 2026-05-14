dockerfile := "Dockerfile"
image-name := "harbor.cyverse.org/de/sonora"
tag := "latest"
platform := "linux/amd64"
build-context := "."
container-runtime := "docker"
build-flags := ""

default: build

deps:
    npm install

build: deps
    npm run build

dev:
    npm run dev

run:
    npm start

build-image:
    {{ container-runtime }} build -f {{ build-context }}/{{ dockerfile }} -t {{ image-name }}:{{ tag }} --platform {{ platform }} {{ build-flags }} {{ build-context }}

push:
    {{ container-runtime }} push {{ image-name }}:{{ tag }}

write-build-file output-file="build.json":
    #!/usr/bin/env bash
    set -euo pipefail

    RUNTIME="{{ container-runtime }}"
    IMAGE_NAME="{{ image-name }}"
    IMAGE_TAG="{{ tag }}"
    OUTPUT_FILE="{{ output-file }}"
    FULL_IMAGE_TAG="${IMAGE_NAME}:${IMAGE_TAG}"

    echo "Extracting sha256 digest from built image: ${FULL_IMAGE_TAG}"
    SHA256_DIGEST=$($RUNTIME inspect --format='{{ "{{" }}index .RepoDigests 0{{ "}}" }}' "$FULL_IMAGE_TAG" 2>/dev/null || true)

    # If RepoDigests is empty (image not pushed), get the image ID instead.
    if [[ -z "$SHA256_DIGEST" ]]; then
        IMAGE_ID=$($RUNTIME inspect --format='{{ "{{" }}.Id{{ "}}" }}' "$FULL_IMAGE_TAG" | cut -d: -f2)
        if [[ -n "$IMAGE_ID" ]]; then
            SHA256_DIGEST="${IMAGE_NAME}@sha256:${IMAGE_ID}"
            echo "Using local image digest: $SHA256_DIGEST"
        else
            echo "Error: Failed to extract image digest for ${FULL_IMAGE_TAG}" >&2
            exit 1
        fi
    else
        echo "Using repo digest: $SHA256_DIGEST"
    fi

    echo "Writing build JSON to: $OUTPUT_FILE"
    cat > "$OUTPUT_FILE" << EOF
    {
      "builds": [
        {
          "imageName": "$IMAGE_NAME",
          "tag": "$SHA256_DIGEST"
        }
      ]
    }
    EOF

test:
    npm test

lint:
    npm run lint

fmt-check:
    npm run check-format

fmt-fix:
    npm run format

check: fmt-check lint test

storybook:
    npm run storybook

build-storybook:
    npm run build-storybook

clean:
    npm run clean
