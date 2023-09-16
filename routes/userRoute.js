const express=require('express')
const router=express.Router()
const {registerUser,loginUser}=require('../controllers/userController')
const {writeReview,deleteReview}=require('../controllers/bookController')
const verifyToken=require('../middleware/authMiddleware')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/auth/review/:isbn/:review',verifyToken,writeReview)
router.delete('/auth/review/:isbn',verifyToken,deleteReview)


module.exports=router;  