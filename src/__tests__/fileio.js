import {
    configurableUploadHandler,
    configurableDownloadHandler,
} from "../server/fileio";
import nock from "nock";

const mockRequest = (filePath, token) => {
    const req = {
        user: {
            accessToken: token || "test-token",
        },
        query: {
            destination: filePath || "",
            source: filePath || "",
        },
        pipe: jest.fn(),
    };

    req.pipe.mockImplementation(() => req);
    return req;
};

const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("/api/upload handler", () => {
    test("with no authentication provided", async () => {
        const res = mockResponse();
        await configurableUploadHandler({}, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Authorization required.");
    });

    test("with no destination provided", async () => {
        const req = mockRequest();
        const res = mockResponse();
        await configurableUploadHandler(req, res, "http://terrain");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            "destination query parameter must be set."
        );
    });

    test("calls terrain API", async () => {
        const destination = "/iplant/home/test/test-file.txt";
        const req = mockRequest(destination, "test-token");
        const res = mockResponse();
        const server = "http://terrain";
        const expected = {
            id: "test-id",
            label: "test-label",
            path: "/iplant/home/ipcdev/test-path.txt",
        };

        // Make sure the important bits are matched by the nock'ed server
        const scope = nock(server, {
            reqheaders: {
                Authorization: `Bearer test-token`,
            },
        })
            .post(`/secured/fileio/upload?dest=${destination}`)
            .reply(200, expected);

        await configurableUploadHandler(req, res, server);
        expect(scope.isDone()); // mocked server was called as expected.
    });
});

describe("/api/download handler", () => {
    test("with no authentication provided", async () => {
        const res = mockResponse();
        await configurableDownloadHandler({}, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Authorization required.");
    });

    test("with no destination provided", async () => {
        const req = mockRequest();
        const res = mockResponse();
        await configurableDownloadHandler(req, res, "http://terrain");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            "source query parameter must be set."
        );
    });
});
