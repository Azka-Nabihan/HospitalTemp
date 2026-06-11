const checkApiKey = (req, res, next) => {
    // Lewati pengecekan untuk endpoint health check dan toggle testing
    if (req.path === '/health' || req.path === '/admin/toggle-api') {
        return next();
    }

    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or missing API Key"
        });
    }

    next();
};

module.exports = { checkApiKey };
