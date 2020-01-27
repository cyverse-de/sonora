import { configurableUploadHandler } from "../server/fileio";
import nock from "nock";

const mockRequest = (destination, token) => {
    let req = {
        user: {
            accessToken: token || "test-token",
        },
        query: {
            destination: destination || "",
        },
    };

    let pipe = jest.fn();
    pipe.mockImplementation(() => req);
    req.pipe = pipe;
    return req;
};

const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("testing /api/upload handler", () => {
    test("no authentication provided", async () => {
        const res = mockResponse();
        await configurableUploadHandler({}, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Authorization required.");
    });

    test("no destination provided", async () => {
        const req = mockRequest();
        const res = mockResponse();
        await configurableUploadHandler(req, res, "http://terrain");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            "destination query parameter must be set."
        );
    });

    test("successful upload", async () => {
        const destination = "/iplant/home/test/test-file.txt";
        const req = mockRequest(destination, "test-token");
        let res = mockResponse();
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
