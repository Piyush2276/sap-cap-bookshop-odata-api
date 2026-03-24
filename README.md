# 📚 Bookshop OData API — SAP CAP (Learning Project)

A **hands-on learning project** built to practice and understand:
- Writing CDS schema and entity modeling
- Building relationships (Associations & Compositions)
- Exposing OData V4 APIs via SAP CAP
- Querying and filtering data using OData operators like
  `$filter`, `$expand`, `$select`, and `$orderby`

> 🧪 This is not a production app — it's a structured practice project
> to strengthen SAP CAP fundamentals before working on enterprise-grade systems.
---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | SAP CAP (Node.js) |
| Database | SQLite (local development) |
| API Protocol | OData V4 |
| Tooling | CDS CLI, VS Code |

---

## 📐 Data Model

Built using **CDS (Core Data Services)** with manual UUID keys and clean
entity relationships.
```
Publishers
  └── Books
        ├── Categories  (many-to-one)
        ├── Orders      (one-to-many)
        └── Reviews     (one-to-many)

Customers
  ├── Address     (Composition of one — lifecycle tied to customer)
  ├── Orders      (one-to-many)
  └── Reviews     (one-to-many, as reviewer)
```

### Entities

#### `Books`
Core entity of the bookshop.
- `title`, `author`, `stock`
- Linked to `Publishers` and `Categories`
- Has many `Orders` and `Reviews`

#### `Orders`
Represents a book purchase.
- `amount` — quantity ordered
- Mandatory associations to both `Books` and `Customers` (`not null`)

#### `Customers`
Registered users of the bookshop.
- `name`, `email`
- **Composition of one** `Address` — address is deleted when customer is deleted
- Has many `Orders` and `Reviews`

#### `Address`
Stores city and state of a customer.
Modeled as **Composition** inside `Customers` — lifecycle fully managed by CAP.

#### `Reviews`
Customer review for a book.
- `rating` (Integer), `comment`
- Associated to both `Customers` (as reviewer) and `Books`

#### `Publishers`
Publishing house entity.
- `name`, `email`
- Has many `Books`

#### `Categories`
Book genre/category classification.
- `name`
- Has many `Books`

---

## 🌐 OData V4 Service — `CatalogService`

All entities exposed under `/odata/v4/CatalogService/`

### Entities

| Endpoint | Description |
|---|---|
| `GET /Books` | List all books |
| `GET /Books?$expand=reviews,publisher,category` | Book with full details |
| `GET /Orders?$expand=book,customer` | Orders with book and customer |
| `GET /Customers?$expand=address,orders` | Customer with address and orders |
| `GET /Reviews?$expand=book,reviewer` | Reviews with book and reviewer |
| `GET /Publishers?$expand=books` | Publisher with all books |
| `GET /Categories?$expand=books` | Category with all books |

### Custom Action & Function

#### `changeStock` — Action
Changes the stock of a book by ID.
```
POST /odata/v4/CatalogService/changeStock
Body: { "ID": "<uuid>", "newStock": 50 }
Returns: String (confirmation message)
```

#### `getStock` — Function
Retrieves current stock of a book by ID.
```
GET /odata/v4/CatalogService/getStock(ID=<uuid>)
Returns: Integer
```

---

## 📁 Project Structure
```
sap-cap-bookshop-odata-api/
├── db/
│   └── schema.cds           # All CDS entity definitions
├── srv/
│   ├── catalog-service.cds  # Service exposure, action & function signatures
│   └── catalog-service.js   # Custom handlers for changeStock & getStock
├── package.json
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- `@sap/cds-dk` installed globally → `npm install -g @sap/cds-dk`

### Run Locally
```bash
git clone https://github.com/Piyush2276/sap-cap-bookshop-odata-api
cd sap-cap-bookshop-odata-api
npm install
cds deploy --to sqlite    # creates local SQLite DB
cds run                   # starts at http://localhost:4004
```

Open in browser:
```
http://localhost:4004/odata/v4/CatalogService
```

---

## 📝 Key Concepts Demonstrated

- ✅ CDS entity modeling with UUID keys
- ✅ **Composition** vs **Association** — correctly used for lifecycle control
- ✅ **Mandatory associations** using `not null`
- ✅ Self-contained domain model (Books, Orders, Customers, Reviews, Publishers, Categories)
- ✅ Custom **OData Action** — `changeStock` (modifies data)
- ✅ Custom **OData Function** — `getStock` (read-only query)
- ✅ OData V4 `$expand` for nested entity navigation
- ✅ Service layer separation (`catalog-service.cds` + `catalog-service.js`)

---

## 👤 Author

**Piyush Kumar**
SAP BTP Backend Developer
📧 piyush2582002@gmail.com
🔗 [LinkedIn](https://linkedin.com/in/piyush-kumar-267367229) |
[GitHub](https://github.com/Piyush2276)
