const Book = require("../models/bookModel");
const stripe = require('stripe')(process.env.stripeKey);

// add-book
exports.addBookController = async (req, res) => {
  try {
    const {
      title,
      author,
      noofpages,
      imageurl,
      price,
      dPrice,
      Abstract,
      publisher,
      language,
      isbn,
      category,
    } = req.body;

    if (
      !title ||
      !author ||
      !noofpages ||
      !imageurl ||
      !price ||
      !dPrice ||
      !Abstract ||
      !publisher ||
      !language ||
      !isbn ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadedImg =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.filename)
        : [];

    // JWT middleware sets req.payload = { userMail: '...', iat: ... }
    const email = req.payload.userMail;   // FIXED

    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const existingBook = await Book.findOne({ title, userMail: email });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "You already added this book!" });
    }

    const newBook = new Book({
      title,
      author,
      noofpages,
      imageurl,
      price,
      dPrice,
      Abstract,
      publisher,
      language,
      isbn,
      category,
      uploadedImg,
      userMail: email,   // string, not object
    });

    const savedBook = await newBook.save();
    return res.status(201).json(savedBook);
  } catch (err) {
    console.error("Add Book Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// To get home books
exports.getHomeBooksController = async (req, res) => {
  try {
    const allHomebooks = await Book.find()
      .sort({ _id: -1 })
      .limit(4);

    res.status(200).json(allHomebooks);
  } catch (err) {
    console.error("Home Books Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// to get all books (USER SIDE: only approved, not own)
exports.getAllBooksController = async (req, res) => {
  try {
    const searchKey = req.query.search || "";     // safe default for regex
    const email = req.payload.userMail;          // FIXED: from JWT payload

    const query = {
      status: "approved",                        // only books approved by admin
      userMail: { $ne: email },                 // exclude books uploaded by this user
      title: { $regex: searchKey, $options: "i" } // search by title (case-insensitive)
    };

    const allbooks = await Book.find(query);
    return res.status(200).json(allbooks);
  } catch (err) {
    console.error("Get All Books Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// to get a particular book
exports.getABookController = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOne({ _id: id });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err);
  }
};

// to get all books added by user
exports.getAllUserBooksController = async (req, res) => {
  console.log("Inside getAllUserBooksController");
  const email = req.payload.userMail;            // FIXED
  console.log(email);
  try {
    const allUserBooks = await Book.find({ userMail: email });
    res.status(200).json(allUserBooks);
  } catch (err) {
    res.status(500).json(err);
  }
};

// to get all books brought by user
exports.getAllUserBroughtBooksController = async (req, res) => {
  console.log("Inside getAllUserBroughtBooksController");
  const email = req.payload.userMail;            // FIXED
  console.log(email);
  try {
    const allUserBroughtBooks = await Book.find({ brought: email });
    res.status(200).json(allUserBroughtBooks);
  } catch (err) {
    res.status(500).json(err);
  }
};

// to delete a user book
exports.deleteABookController = async (req, res) => {
  console.log("Inside deleteABookController");
  const { id } = req.params;
  try {
    await Book.findByIdAndDelete({ _id: id });
    res.status(200).json("delete Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

// to make payment
exports.makePaymentController = async (req, res) => {
  console.log("Inside deleteABookController");
  const {bookDetails} = req.body
  const {userMail} = req.payload
  try {
    const existingBook = await Book.findByIdAndUpdate({_id:bookDetails._id},
      {title:bookDetails.title,
        author:bookDetails.author,
        noofpages:bookDetails.noofpages,
        imageurl:bookDetails.imageurl,
        price:bookDetails.price,
        dPrice:bookDetails.dPrice,
        Abstract:bookDetails.Abstract,
        publisher:bookDetails.publisher,
        language:bookDetails.language,
        isbn:bookDetails.isbn,
        category:bookDetails.category,
        uploadedImg:bookDetails.uploadedImg,
        status:'sold',
        userMail:bookDetails.userMail,
        brought:userMail,
      },{new:true})

      // variable of lineitem
      const line_item=[{
        price_data:{
          currency:"usd",
          product_data:{
            name:bookDetails.title,
            description:`${bookDetails.author} | ${bookDetails.publisher}`,
            images:[bookDetails.imageurl],
            metadata:{
                      title:bookDetails.title,
                      author:bookDetails.author,
                      noofpages:`${bookDetails.noofpages}`,
                      imageurl:bookDetails.imageurl,
                      price:`${bookDetails.price}`,
                      dPrice:`${bookDetails.dPrice}`,
                      Abstract:bookDetails.Abstract,
                      publisher:bookDetails.publisher,
                      language:bookDetails.language,
                      isbn:bookDetails.isbn,
                      category:bookDetails.category,
                      //uploadedImg:bookDetails.uploadedImg,
                      status:'sold',
                      userMail:bookDetails.userMail,
                      brought:userMail,
            }
          },
          unit_amount: Math.round(bookDetails.dPrice*100) // cents
        },
        quantity:1
      }]
      // create stripe checkout session
      const session = await stripe.checkout.sessions.create({
        // purchased using cards
        payment_method_types:['card'],
        // details of products that purchased
        line_items: line_item,
        // make payment
        mode: 'payment',
        // if payment is success- the url of page to shown
        success_url:"https://bookstore-f.vercel.app//payment-success",
        // if payment failed- the url of page to shown
        cancel_url:"https://bookstore-f.vercel.app//payment-error"
      });
      console.log(session);
      res.status(200).json({url:session.url})
      


  } catch (err) {
    res.status(500).json(err);
  }
};

//................ADMIN................

exports.getAllBooksAdminController = async (req, res) => {
  try {
    const allbooks = await Book.find();
    res.status(200).json(allbooks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.approveBookController = async (req, res) => {
  const {
    _id,
    title,
    author,
    noofpages,
    imageurl,
    price,
    dPrice,
    Abstract,
    publisher,
    language,
    isbn,
    category,
    uploadedImg,
    status,
    userMail,
    brought,
  } = req.body;

  console.log(
    _id,
    title,
    author,
    noofpages,
    imageurl,
    price,
    dPrice,
    Abstract,
    publisher,
    language,
    isbn,
    category,
    uploadedImg,
    status,
    userMail,
    brought
  );

  try {
    const existingBook = await Book.findByIdAndUpdate(
      { _id },
      {
        _id,
        title,
        author,
        noofpages,
        imageurl,
        price,
        dPrice,
        Abstract,
        publisher,
        language,
        isbn,
        category,
        uploadedImg,
        status: "approved",   // always set approved
        userMail,
        brought,
      },
      { new: true }
    );
    res.status(200).json(existingBook);
  } catch (err) {
    res.status(500).json(err);
  }
};
