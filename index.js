const app = require("./app");
require("dotenv").config();
require("colors").enable();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).send("Welcome Dude!");
});

app.listen(PORT, () => {
  console.log(`Server is Started At Port ${PORT}`.red.italic.underline);
});
