module.exports = (err, req, res, next) => {
  console.error("[Server Error]", err);

  if (err.code === "P2002") {
    return res.status(409).json({ success: false, message: "A record with this value already exists." });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Uploaded file is too large." });
  }

  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
};
