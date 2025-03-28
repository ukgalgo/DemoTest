export default async function handler(req, res) {
    const { path, ...query } = req.query;

    if (!path) {
        return res.status(400).json({ error: "Missing API path" });
    }

    // Construct the target API URL
    const targetURL = `https://apiv2.cricket.com.au/mobile/${Array.isArray(path) ? path.join("/") : path}`;
    const queryString = new URLSearchParams(query).toString();
    const finalURL = queryString ? `${targetURL}?${queryString}` : targetURL;

    try {
        // console.log(`🔄 Proxying request to: ${finalURL}`);

        const response = await fetch(finalURL, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to fetch data", details: error.toString() });
    }
}
