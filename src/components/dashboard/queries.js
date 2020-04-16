export default async (_key, limit) => {
    let data = await fetch(`/api/dashboard?limit=${limit}`, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (resp) => {
            if (resp.status < 200 || resp.status > 299) {
                const msg = await resp.text();
                throw new Error(`${resp.status} ${resp.statusText} ${msg}`);
            }
            return resp;
        })
        .then((resp) => resp.json())
        .catch((e) => {
            console.log(e);
        });

    if (!data) {
        data = {};
    }
    return data;
};
