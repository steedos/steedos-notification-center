import { GraphQLObjectType } from 'graphql'
import { GraphQLJSON } from 'graphql-type-json'

import { login, me } from './data'

export const queryAuth = {
  type: GraphQLJSON,
  args: {
    login: {
      type: GraphQLJSON,
    },
  },
  async resolve(source, args, context, info) {
    return { login }
  },
}

export const queryMe = {
  type: GraphQLJSON,
  async resolve(source, args, context, info) {
    return me
  },
}

export const queryConfig = {
  name: 'RootQueryType',
  fields: {
    auth: queryAuth,
    me: queryMe,
  },
}

export const mutationConfig = {
  name: 'MutationRootType',
  fields: {},
}

const schemaConfig = {
  query: new GraphQLObjectType(queryConfig),
  // mutation: new GraphQLObjectType(mutationConfig)
}

export default schemaConfig
