const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("You are not logged in!");
    },
  },

  Mutations: {
    // login validation function
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      // check to see if this is the correct user
      if (!user) {
        throw new AuthenticationError("This user is invalid");
      }
      const corrrectPassword = await User.isCorrectPassword(correctPW);
      // check to see if this is the correct password
      if (!corrrectPassword) {
        throw new AuthenticationError("This password is incorrect");
      }

      // add the token if both pass
      const token = signToken(user);
      return { token, user };
    },
    // create new user function
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // save book to database and update
    saveBook: async (_, { input }, context) => {
      if (context.user) {
        const bookMuForUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { saveBook: input } },
          { new: true }
        );
        return bookMuForUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },
};

module.exports = resolvers;
