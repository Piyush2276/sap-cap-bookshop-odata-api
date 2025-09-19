namespace my.bookshop;

entity Books {
  key ID     : UUID;
      title  : String;
      author : String;
      stock  : Integer;

      // One-to-many: one book can have many orders
      orders : Association to many Orders on orders.book = $self;
      reviews : Association to many Reviews on reviews.book = $self;
      publisher: Association to Publishers;
      category : Association to Categories;
}

entity Orders {
  key ID       : UUID;
      amount   : Integer;

      book     : Association to Books    not null;  // mandatory relation
      customer : Association to Customers not null;
}

entity Customers {
  key ID     : UUID;
      name   : String;
      email  : String;

      address : Composition of Address on address.customer = $self;

      orders  : Association to many Orders on orders.customer = $self;
      reviewers : Association to many Reviews on reviewers.reviewer = $self;
}

entity Address {
  key ID     : UUID;
      city   : String;
      state  : String;

      customer : Association to Customers;
}

entity Reviews {
  key ID       : UUID;
      rating   : Integer;
      comment  : String;

      reviewer : Association to Customers ;
      book : Association to Books;
}

entity Publishers {
  key ID    : UUID;
      name  : String;
      email : String;
      books : Association to many Books on books.publisher = $self;
}

entity Categories {
  key ID   : UUID;
      name : String;
      books: Association to many Books on books.category = $self;
}