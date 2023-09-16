const fs = require('fs')
const asyncHandler=require('express-async-handler')

const readBookData=()=>{
    return JSON.parse(fs.readFileSync('./data/books.json','utf-8'))
}


const getAllBooks=asyncHandler(async(req,res)=>{
    let booksData=readBookData()

    return res.status(200).json(booksData)
})


// type=1 -> get data by ISBN, para -> ISBN Number
// type=2 -> get data by author, para -> Author
// type=3 -> get data by title, para -> BookTitle
const helper=(type,para)=>{ 
    let booksData=readBookData()['books']
    var keys = Object.keys( booksData );

    let data=[]

    for(let i=0;i<keys.length;i++)
    {
        if(type===1)
        {
            if(keys[i]===para)
            {
                return booksData[keys[i]]
            }
        }
        else if(type===2)
        {
            if(booksData[keys[i]].author===para)
            {
                data.push(booksData[keys[i]])
            }
        }
        else if(type===3)
        {
            if(booksData[keys[i]].title===para)
            {
                data.push(booksData[keys[i]])
            }
        }
    }

    return data
}


const getISBNBook=asyncHandler(async(req,res)=>{

    const isbn=req.params.isbn

    let data=helper(1,isbn)

    return res.status(200).json(data)
})


const getAuthorBook=asyncHandler(async(req,res)=>{

    const author=req.params.author

    let data=helper(2,author)

    return res.status(200).json(data)
})

const getTitleBook=asyncHandler(async(req,res)=>{
    const title=req.params.title

    let data=helper(3,title)

    return res.status(200).json(data)
})

const getBookReview=asyncHandler(async(req,res)=>{
    const isbn=req.params.isbn

    let data=helper(1,isbn).reviews

    return res.status(200).json(data)
})

const writeReview=asyncHandler(async(req,res)=>{
    const {isbn,review}=req.params

    
    if(!isbn || !review)
    {
        res.status(400).json({'message':'not found!'})
        return
    }
    
    const username=req.username

    let bookData=readBookData()

    var keys=Object.keys(bookData['books'])


    for(let i=0;i<keys.length;i++)
    {
        if(keys[i]===isbn)
        {
            let bookKeys=Object.keys(bookData['books'][keys[i]].reviews)

            let updated=false

            for(let j=0;j<bookKeys.length;j++)
            {
                if(bookData['books'][keys[i]].reviews[j].username===username)
                {
                    bookData['books'][keys[i]].reviews[j]={'username':username,'review':review}
                    updated=true
                    break
                }
            }

            if(!updated)
            {
                bookData['books'][keys[i]].reviews.push({'username':username,'review':review})
                updated=true
            }

            fs.writeFileSync('./data/books.json',JSON.stringify(bookData))
        }
    }


    return res.status(200).json({'message':`The review for the book with ISBN ${isbn} has been added/updated`})
})

function withoutProperty(obj, property) {  
    const { [property]: unused, ...rest } = obj

  return rest
}

const deleteReview=asyncHandler(async(req,res)=>{
    const isbn=req.params.isbn

    if(!isbn)
    {
        res.status(400).json({'message':'not found!'})
        return
    }

    const username=req.username

    let bookData=readBookData()

    var keys=Object.keys(bookData['books'])

    for(let i=0;i<keys.length;i++)
    {
        if(keys[i]===isbn)
        {
            bookData['books'][keys[i]].reviews=bookData['books'][keys[i]].reviews.filter((item)=>item.username!==username)

            
            console.log(bookData)

            fs.writeFileSync('./data/books.json',JSON.stringify(bookData))
        
        }
    }

    return res.status(200).json({'message':`Reviews for the ISBN ${isbn} posted by user ${username} deleted!`})
})

module.exports={getAllBooks,getISBNBook,getAuthorBook,getTitleBook,writeReview,deleteReview,getBookReview}
