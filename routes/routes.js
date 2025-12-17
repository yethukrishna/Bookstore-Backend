const express = require("express");
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const jwtAdminMiddleware = require("../middleware/jwtAdminMiddleware");
const multerConfig = require("../middleware/multerMiddleware");

const router = express.Router();

// User routes
router.post("/register", userController.registerController);
router.post("/login", userController.loginController);
router.post("/google-login", userController.googleLoginController);

// Add book route
router.post(
  "/add-book",
  jwtMiddleware,
  multerConfig.array("uploadedImages", 3),
  bookController.addBookController
);

// path to get home books
router.get("/home-books",bookController.getHomeBooksController)

// path to get all books
router.get("/all-books",jwtMiddleware,bookController.getAllBooksController)

// path to view a book
router.get("/view-books/:id",bookController.getABookController)

// path to update user profile
router.put(
  "/user-profile-update",jwtMiddleware,multerConfig.single("profile"),userController.editUserProfileController);

// path to get all user added books
router.get("/user-add-books",jwtMiddleware,bookController.getAllUserBooksController)

// path to get all user brought books
router.get("/user-brought-books",jwtMiddleware,bookController.getAllUserBroughtBooksController)

// path to delete a user book
router.delete("/delete-user-book/:id",jwtMiddleware,bookController.deleteABookController)

// path to make payment
router.put("/make-payment",jwtMiddleware,bookController.makePaymentController)


//..............Admin.................

// path to get all books to admin
router.get("/admin-all-books",jwtAdminMiddleware,bookController.getAllBooksAdminController)

// path to approve book by admin
router.put("/approve-books",jwtAdminMiddleware,bookController.approveBookController)

// path to get all users to admin
router.get("/all-users",jwtAdminMiddleware,userController.getAlluserController)

// path to update admin profile
router.put(
  "/admin-profile-update",
  jwtAdminMiddleware,
  multerConfig.single("profile"),
  userController.editAdminProfileController
);



module.exports = router;