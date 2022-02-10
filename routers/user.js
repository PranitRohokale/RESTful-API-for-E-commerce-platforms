const router = require("express").Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  changePassword,
  updateUserDetails,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateUserRole,
} = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

//POST ROUTES
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);

//GET ROUTES
router.route("/logout").get(logout);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);

//PUT ROUTES
router.route("/password/update").put(isLoggedIn, changePassword);
router.route("/userdashboard/update").put(isLoggedIn, updateUserDetails);

//ADMIN ROUTES
router.get("/admin/users", isLoggedIn, customRole("admin"), getAllUsers);
router
  .route("/admin/user/:userId")
  .get(isLoggedIn, customRole("admin"), getOneUser)
  .put(isLoggedIn, customRole("admin"), updateUserRole)
  .delete(isLoggedIn, customRole("admin"), deleteOneUser)


module.exports = router;
