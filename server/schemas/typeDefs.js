const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # User creation and login params
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  # Book params
  type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
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

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      title: String!
      authors: [String]
      description: String!
      bookId: String!
      image: String
      link: String
    ): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
