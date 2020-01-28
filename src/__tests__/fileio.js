import {
    configurableUploadHandler,
    configurableDownloadHandler,
} from "../server/fileio";

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
    test("with no authentication provided", async (done) => {
        const res = mockResponse();
        await configurableUploadHandler({}, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Authorization required.");
        done();
    });

    test("with no destination provided", async (done) => {
        const req = mockRequest();
        const res = mockResponse();
        await configurableUploadHandler(req, res, "http://terrain");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            "destination query parameter must be set."
        );
        done();
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
