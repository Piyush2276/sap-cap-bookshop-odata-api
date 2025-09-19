module.exports = srv => {
  const { Orders, Books, Reviews, Customers } = srv.entities;

  // Validate order before creation
  srv.before('CREATE', 'Orders', async req => {
    const { amount, book_ID } = req.data;

    // Basic validation
    if (!book_ID || amount <= 0) {
      return req.error(400, 'Invalid order: Book ID must be provided and amount must be greater than 0.');
    }

    const tx = cds.transaction(req);

    // Check if the book exists
    const book = await tx.run(SELECT.one.from(Books).where({ ID: book_ID }));
    if (!book) {
      return req.error(404, `Book with ID ${book_ID} not found.`);
    }

    // Optional: Check if enough stock is available
    if (book.stock < amount) {
      return req.error(400, `Insufficient stock. Only ${book.stock} item(s) available.`);
    }

    // Optional: Reduce stock now (you can also do this in after handler)
    // await tx.run(UPDATE(Books).set({ stock: book.stock - amount }).where({ ID: book_ID }));
  });


  //---------------------------------------------------------------------------------------------

// Before creating a Review, validate customer_ID
srv.before('CREATE', 'Reviews', async req => {
  const { customer_ID } = req.data;

  // Check if customer_ID is provided
  if (!customer_ID) {
    return req.error(400, 'A valid customer_ID is required to submit a review.');
  }

  // Check if customer_ID exists in the database
  const tx = cds.transaction(req);
  const customerExists = await tx.run(
    SELECT.one.from(Customers).where({ ID: customer_ID })
  );

  if (!customerExists) {
    return req.error(404, `Customer with ID ${customer_ID} does not exist.`);
  }
});

//-----------------------------------------------------------------------------------------------
 // Validate email format before creating or updating a Customer
 const validateEmail = (req)=>{
  const{email} = req.data;
  if(!email || !email.includes('@')){
    return req.error(400, 'Invalid email address. Must contain "@" symbol.');
  }
 };

srv.before(['CREATE', 'UPDATE'], 'Customers', validateEmail);

// srv.on('getStock', async (req) => {
//   const { bookID } = req.params;

//   const book = await SELECT.one.from(Books).where({ ID: bookID });

//   if (!book) return req.error(404, 'Book not found');

//   return book.stock;
// });

srv.on('changeStock', async (req) => {
  const { ID, newStock } = req.data;

  const book = await SELECT.one.from(Books).where({ ID });

  if (!book) return req.error(404, 'Book not found');

  await UPDATE(Books).set({ stock: newStock }).where({ ID });

  return { message: `Stock updated to ${newStock}` };
});

srv.on("getStock", async (req) =>{

  const {ID} = req.data;
  
  const book = await SELECT.one.from(Books).where({ID});

  if(!book) return req.error(404, "Book not found");
  console.log("typeof book.stock ",typeof book.stock);

  return book.stock;

} )

// check if review is valid or not
srv.before('CREATE', Reviews, async (req) => {
  const { book_ID, customer_ID } = req.data;

  if (!customer_ID) {
    return req.error(400, 'A valid customer_ID is required to submit a review.');
  }

  if (!book_ID) {
    return req.error(400, 'A valid book_ID is required to submit a review.');
  }

  const hasOrdered = await SELECT.one.from(Orders).where({ book_ID, customer_ID });

  if (!hasOrdered) {
    return req.error(400, 'You can only review books you have purchased.');
  }
});
};
