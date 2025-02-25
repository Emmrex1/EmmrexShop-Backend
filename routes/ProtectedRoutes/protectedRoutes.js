// const express = require("express");
// const { protect, admin } = require("../../middleware/authmiddleware");


// const router = express.Router();

// // Public route
// router.get("/public", (req, res) => {
//   res.status(200).json({ message: "Public route accessible to everyone" });
// });

// // Protected route (Requires Authentication
// router.get("/protected", protect, (req, res) => {
//   res.status(200).json({
//     message: `Welcome ${req.user.name}, you are authorized to access this route`,
//   });
// });

// // Admin-only route
// router.get("/admin", protect, admin, (req, res) => {
//   res.status(200).json({
//     message: `Admin route accessed by ${req.user.name} with role ${req.user.role}`,
//   });
// });

// module.exports = router;
