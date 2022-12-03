const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # User creation and login params
  type User {
    _id: _id
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  # Book params
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # JWTokens authorization
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutaiton {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: String): User
  }
`;

module.exports = typeDefs;
