
const express = require('express');
const { 
  registerUser,
   loginUser,
   getAllUsers,
   getUserById,
   deleteUser,
   updateUser,
   getUserProfile,
   forgotPassword,
   resetPassword

 } = require('../../Controllers/userController');
const { protect, isAdmin } = require('../../middleware/authmiddleware');

const router = express.Router();


router.post('/register', registerUser);

router.post('/login', loginUser);

router.get("/users", protect, isAdmin, getAllUsers);  
router.delete("/users/:id", protect, isAdmin, deleteUser);  
router.get('/users/:id',protect,isAdmin, getUserById);
router.put('/users/:id',protect,isAdmin, updateUser);
router.put('/users/:id',protect,isAdmin, updateUser);
router.get("/profile", protect, getUserProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


module.exports = router;
