/**
 * @jest-environment node
 */
import http from "http";
import express from "express";

import uploadHandler from "../server/api/uploads";
import downloadHandler, {
    metadataTemplateCSVhandler,
} from "../server/api/downloads";

jest.mock("../server/logging", () => ({
    __esModule: true,
    default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock("../server/configuration", () => ({
    get terrainURL() {
        return global.fakeTerrainURL;
    },
}));

const listen = (server) =>
    new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () =>
            resolve(`http://127.0.0.1:${server.address().port}`)
        );
    });

const close = (server) => new Promise((resolve) => server.close(resolve));

const accessToken = {
    token: "test-token",
    content: { preferred_username: "test-user" },
};

let terrain;
let terrainRequests;
let terrainResponder;
let sonora;
let sonoraURL;

beforeAll(async () => {
    terrain = http.createServer((req, res) => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => {
            terrainRequests.push({
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: Buffer.concat(chunks).toString(),
            });
            terrainResponder(req, res);
        });
    });
    global.fakeTerrainURL = await listen(terrain);

    const app = express();
    app.use((req, res, next) => {
        if (req.headers["x-test-logged-in"]) {
            req.kauth = { grant: { access_token: accessToken } };
        }
        next();
    });
    app.post("/api/upload", uploadHandler);
    app.get("/api/download", downloadHandler);
    app.get(
        "/api/filesystem/metadata/template/:templateId/zip-csv",
        metadataTemplateCSVhandler
    );
    sonora = http.createServer(app);
    sonoraURL = await listen(sonora);
});

afterAll(async () => {
    await close(sonora);
    await close(terrain);
});

beforeEach(() => {
    terrainRequests = [];
    terrainResponder = (req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
    };
});

it("streams an upload to Terrain and returns the Terrain response", async () => {
    const form = new FormData();
    form.append("file", new Blob(["file contents"]), "test.txt");

    terrainResponder = (req, res) => {
        res.writeHead(201, {
            "Content-Type": "application/json",
            "X-Terrain-Header": "uploaded",
        });
        res.end(JSON.stringify({ file: { id: "abc" } }));
    };

    const response = await fetch(
        `${sonoraURL}/api/upload?dest=${encodeURIComponent("/iplant/home/a b")}`,
        {
            method: "POST",
            headers: { "X-Test-Logged-In": "1", Cookie: "connect.sid=secret" },
            body: form,
        }
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("x-terrain-header")).toBe("uploaded");
    expect(await response.json()).toEqual({ file: { id: "abc" } });

    const [terrainRequest] = terrainRequests;
    expect(terrainRequest.method).toBe("POST");
    expect(terrainRequest.url).toBe(
        "/secured/fileio/upload?dest=%2Fiplant%2Fhome%2Fa%20b"
    );
    expect(terrainRequest.headers.authorization).toBe("Bearer test-token");
    expect(terrainRequest.headers["content-type"]).toMatch(
        /^multipart\/form-data; boundary=/
    );
    expect(terrainRequest.headers.cookie).toBeUndefined();
    expect(terrainRequest.body).toContain("file contents");
    expect(terrainRequest.body).toContain('filename="test.txt"');
});

it("rejects an upload without a destination", async () => {
    const response = await fetch(`${sonoraURL}/api/upload`, {
        method: "POST",
        headers: { "X-Test-Logged-In": "1" },
        body: "data",
    });

    expect(response.status).toBe(400);
    expect(terrainRequests).toHaveLength(0);
});

it("forwards Range requests for downloads and the partial response", async () => {
    terrainResponder = (req, res) => {
        res.writeHead(206, {
            "Content-Type": "video/mp4",
            "Content-Range": "bytes 0-3/10",
            "Content-Disposition": 'attachment; filename="video.mp4"',
            "Content-Length": "4",
        });
        res.end("0123");
    };

    const response = await fetch(
        `${sonoraURL}/api/download?path=${encodeURIComponent("/iplant/home/a b.mp4")}`,
        {
            headers: {
                "X-Test-Logged-In": "1",
                Cookie: "connect.sid=secret",
                Range: "bytes=0-3",
            },
        }
    );

    expect(response.status).toBe(206);
    expect(response.headers.get("content-type")).toBe("video/mp4");
    expect(response.headers.get("content-range")).toBe("bytes 0-3/10");
    expect(response.headers.get("content-disposition")).toBe(
        'attachment; filename="video.mp4"'
    );
    expect(await response.text()).toBe("0123");

    const [terrainRequest] = terrainRequests;
    expect(terrainRequest.method).toBe("GET");
    expect(terrainRequest.url).toBe(
        "/fileio/download?path=%2Fiplant%2Fhome%2Fa%20b.mp4"
    );
    expect(terrainRequest.headers.authorization).toBe("Bearer test-token");
    expect(terrainRequest.headers.accept).toBe("application/octet-stream");
    expect(terrainRequest.headers.range).toBe("bytes=0-3");
    expect(terrainRequest.headers.cookie).toBeUndefined();
});

it("downloads display URLs without auth when logged out", async () => {
    const response = await fetch(
        `${sonoraURL}/api/download?url=1&attachment=1&path=${encodeURIComponent("/a.txt")}`
    );

    expect(response.status).toBe(200);

    const [terrainRequest] = terrainRequests;
    expect(terrainRequest.url).toBe(
        "/filesystem/display-download?path=%2Fa.txt&attachment=1"
    );
    expect(terrainRequest.headers.authorization).toBeUndefined();
});

it("returns Terrain error responses for downloads", async () => {
    terrainResponder = (req, res) => {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error_code: "ERR_DOES_NOT_EXIST" }));
    };

    const response = await fetch(`${sonoraURL}/api/download?path=%2Fmissing`, {
        headers: { "X-Test-Logged-In": "1" },
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
        error_code: "ERR_DOES_NOT_EXIST",
    });
});

it("downloads metadata template CSV files", async () => {
    terrainResponder = (req, res) => {
        res.writeHead(200, { "Content-Type": "application/zip" });
        res.end("zip");
    };

    const response = await fetch(
        `${sonoraURL}/api/filesystem/metadata/template/template-id/zip-csv`,
        { headers: { "X-Test-Logged-In": "1" } }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/zip");
    expect(await response.text()).toBe("zip");

    const [terrainRequest] = terrainRequests;
    expect(terrainRequest.url).toBe(
        "/secured/filesystem/metadata/template/template-id/zip-csv"
    );
    expect(terrainRequest.headers.authorization).toBe("Bearer test-token");
});

it("returns 502 when Terrain is unreachable", async () => {
    const terrainURL = global.fakeTerrainURL;
    global.fakeTerrainURL = "http://127.0.0.1:1";

    try {
        const response = await fetch(`${sonoraURL}/api/download?path=%2Fa`, {
            headers: { "X-Test-Logged-In": "1" },
        });

        expect(response.status).toBe(502);
    } finally {
        global.fakeTerrainURL = terrainURL;
    }
});
