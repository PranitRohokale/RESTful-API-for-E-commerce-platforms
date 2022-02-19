const BigPromise = require("../middlewares/bigPromise");
const Product = require("../models/product");
const cloudinary = require("cloudinary");
const CustomeError = require("../utils/customerError");
const WhereClause = require("../utils/whereClause");

exports.testProduct = BigPromise((req, res, next) => {
  res.status(200).send("This is Test product Route");
});

exports.createProduct = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomeError("photos are required", 400));
  }

  let photoArray = [];

  if (req.files.photo) {
    for (let i = 0; i < req.files.photo.length; i++) {
      const result = await cloudinary.v2.uploader.upload(
        req.files.photo[i].tempFilePath,
        {
          folder: "Products",
        }
      );

      photoArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = photoArray;
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultPerPage = 6
  const totalProducts = await Product.countDocuments();

  const productObj = new WhereClause(Product.find(), req.query).search().filter()
  productObj.pager(resultPerPage)

  const products = await productObj.base.clone()

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    searchResultCount : products.length
  });
});
