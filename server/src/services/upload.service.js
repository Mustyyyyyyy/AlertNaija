let cloudinary;
function getCloudinary() {
  if (!cloudinary) {
    cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  return cloudinary;
}

exports.uploadImage = async (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const cld = getCloudinary();
      const stream = cld.uploader.upload_stream(
        { folder: "alertnaija/incidents" },
        (err, result) => { if (err) return reject(err); resolve(result.secure_url); }
      );
      stream.end(buffer);
    } catch(e) { reject(e); }
  });
};
