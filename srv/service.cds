using { my.bookshop as myshop } from '../db/schema';

@path: 'CatalogService'
service CatalogService {
  entity Books  as projection on myshop.Books;
  entity Orders as projection on myshop.Orders;
  entity Customers as projection on myshop.Customers;
  entity Reviews as projection on myshop.Reviews;
  entity Address as projection on myshop.Address;
  entity Publishers as projection on myshop.Publishers;
  entity Categories  as projection on myshop.Categories;

  action changeStock(ID: UUID, newStock: Integer) returns String ;
  
  function getStock(ID: UUID) returns Integer;


}
