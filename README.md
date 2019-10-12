# Apollo Federation 

`gateway` is an ApolloGateway, connecting multiple ApolloServers, such as `userAPI` and `bookAPI`.

---

## Run the project:
 - Change directory to `/gateway`.
 - Start up the `userAPI` by running command:
 ```
 npm run start-user-api
 ```
 - Start up the `bookAPI` by running command:
 ```
 npm run start-book-api
 ```
 - Start up the `gateway` by running command:
 ```
 npm run start-gateway
 ```

 GraphQL playground will be started on `localhost:4000`.

---

 ## Example queries:

 Get user name and surname by ID from `userAPI`:
 ```
{
  getUser(id: 0) { name, surname }
}
 ```

Get book title, author and current reader by ID from `bookAPI`. Also get current readers name and surname from `userAPI` and other owned books from `bookAPI`:
```
{ 
  getBook(id: 0) { 
  	title, 
  	author, 
  	currentReader { 
      name, 
      surname,
      books { 
        title, 
        author 
      } 
    } 
	} 
}
```

Get user name and surname by ID from `userAPI` and also get his currently owned books from `bookAPI`:
```
{
  getUser(id: 1) {
    name,
    surname,
    books {
      title,
      author
    }
  }
}
```

---

## Learnings

- A gateway sits in front of multiple GraphQL APIs (called 'services'). It stitches together each API schema and automatically resolves data from each API. For example if we ask for user name who owns particular book, gateway will get book details from `bookAPI`and fetch user name from `userAPI` automatically.

- When using type from another schema we still need to define it in current schema by extending it:
 ```
   type Book @key(fields: "id") {
    id: ID!
    title: String
    author: String
    currentReader: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
  }
 ```

  Above, we use `User` type from `userAPI` in `Book` type from `bookAPI`. However, `bookAPI` knows nothing about existance of `User` type, therefore we still need to define it.

  - We can extend type from another schema with additional values:
   ```
   type Book @key(fields: "id") {
    id: ID!
    title: String
    author: String
    currentReader: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    books: [Book]
  }
 ```

 Above, we take `User` type from `userAPI` and extend it with field `books` which shows data from `bookAPI`.