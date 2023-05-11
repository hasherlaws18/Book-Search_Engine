const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User{
    _id: ID!
    username: String!
    email: String!
    bookcount: Int
    savedBooks: [Book]
}

type Book{
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth{
    token: ID!
    user: User
}
type Query{
        me: User
}

input SavedBookInput {
    authors: [String]!
    description: String!
    bookId: String!
    image: String
    link: String
    title: String
}
    
type Mutation{
        addUser(username: String!, email: String!, password: String!): Auth
        login(emial: String!, password: String!): Auth
        SaveBook(book: SavedBookInput): User
        RemoveBook(bookId: String!): User
}`

module.exports = typeDefs;