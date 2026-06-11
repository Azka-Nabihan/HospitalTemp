let isApiAvailable = true;

const checkApiStatus = (req, res, next) => {
  // If API is disabled, return 503 Service Unavailable, simulating SIMRS downtime
  if (!isApiAvailable) {
    return res.status(503).json({
      success: false,
      offline: true,
      message: "Sistem sedang offline. Registrasi akan diverifikasi admin dalam 30 menit."
    });
  }
  next();
};

const setApiStatus = (status) => {
  isApiAvailable = status;
};

module.exports = { checkApiStatus, setApiStatus };
