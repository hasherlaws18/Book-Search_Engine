const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
    me: async (parent, args, context) => {
        if(context.user) {
            const user = await User.findOne({_id: context.user._id}).select('__v -password')
            return user;
        }
        throw new AuthenticationError("Not user is found with this ID")
    },
},
    Mutation: {
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user}
          },

    login: async (parent, {email, password}) => {
        const user = await User.findOne({email});
        
        if(!user){
            throw new AuthenticationError("Wrong Credentials")
        }
        const correctPW = await User.isCorrectPassword({password})

        if(!correctPW){
            throw new AuthenticationError("Wrong Credentials")
        }

        const token = signToken(user);

        return {token, user};

    },

      SaveBook: async(parent, {book}, context) => {
         if(context.user) {
            const updateuser = await User.findOneAndUpdate(
                {_id: context.user._id },
                {$addToSet: {
                    savedBooks: book
                }},
                {new: true, runValidators: true }
            );
            return updateuser;
         }
         throw new AuthenticationError('You need to be logged in!')
      },

      RemoveBook: async(parent, {bookId}, context) => {
          if(context.user){
            const updateuser = await User.findByIdAndUpdate(
                {_id: context.user._id },
                {$pull: {
                    savedBooks: {bookId: bookId}
                }},
                {new: true}
            );
            return updateuser;
          }
      },
    }
};

module.exports = resolvers;