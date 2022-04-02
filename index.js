const app = require("./app");
require("dotenv").config();
require("colors").enable();
require("./config/db").connectDb();

const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 4000;

//cloudniary config here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.get("/", (req, res) => {
  res.status(200).send("Welcome Dude!");
});

app.listen(PORT, () => {
  console.log(`Server is Started At Port ${PORT}`.red.italic.underline);
});
