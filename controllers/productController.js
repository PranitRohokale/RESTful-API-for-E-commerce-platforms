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
  const resultPerPage = 6;
  const totalProducts = await Product.countDocuments();

  const productObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  productObj.pager(resultPerPage);

  const products = await productObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    searchResultCount: products.length,
  });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomeError("Product does not exits!", 403));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new CustomeError("Product not exists!", 400));
  


  if (req.files && req.files.photo) {
    //deleting earlier photos
    for (let i = 0; i < product.photos.length; i++) {
      const res = await cloudinary.v2.uploader.destroy(product.photos[i].id);
      
    }
    console.log(`deleted`);
    //uploading new products
    let photoArray = [];
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
    
    req.body.photos = photoArray;
  }

  req.body.user = req.user._id;
  console.log(req.body);
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });

  console.log(product);
});

exports.deleteProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new CustomeError("Product not exists!", 400));

  //deleting earlier photos
  for (let i = 0; i < product.photos.length; i++) {
    await cloudinary.v2.uploader.destroy(product.photos[i].id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product was removed!",
  });
});
