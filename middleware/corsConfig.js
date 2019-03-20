const corsConfig = {
  credentials: true,
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5000",
      "https://air-fitness.netlify.com"
    ];
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

module.exports = corsConfig;
