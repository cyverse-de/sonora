const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const nextHandler = app.getRequestHandler();

app.prepare()

    .then(() => {
        const server = express();

        server.get("*", (req, res) => {
            return nextHandler(req, res);
        });

        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Read on http://localhost:${{ port }}`);
        });
    })

    .catch((exception) => {
        console.error(exception.stack);
        process.exit(1);
    });
