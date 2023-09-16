const express=require('express')
const router=express.Router()
const {getAllBooks,getISBNBook,getAuthorBook,getTitleBook}=require('../controllers/bookController')



router.get('/',getAllBooks)
router.get('/isbn/:isbn',getISBNBook)
router.get('/author/:author',getAuthorBook)
router.get('/title/:title',getTitleBook)



module.exports=router;  