const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

//cloudionary account p WANDERLUST_DEV naam k folder m photo save hone chaiye ese hai 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WANDERLUST_DEV',
    //   format: async (req, file) => 'png', // supports promises as well
    allowedFormats : ["png","jpeg","jpg"]
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }