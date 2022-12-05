const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");
        return userData;
      }
      throw new AuthenticationError("You are not logged in!");
    },
  },

  Mutation: {
    // login validation function
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      // check to see if this is the correct user
      if (!user) {
        throw new AuthenticationError("This email is invalid");
      }
      const correctPw = await user.isCorrectPassword(password);
      // check to see if this is the correct password
      if (!correctPw) {
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
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { saveBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },
};

module.exports = resolvers;
