import { GraphQLObjectType } from 'graphql'
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from 'graphql-tools'
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json'

import { login, me } from './data'

const schemaConfig = `
  scalar JSON
  scalar JSONObject

  type RootQuery {
    login: JSONObject,
    me: JSONObject
  }
  schema {
    query: RootQuery
  }
`

const schemaResolvers = {
  RootQuery: {
    login: (r: any, a: { [key: string]: any }, ctx: any) => login(),
    me: (r: any, a: { [key: string]: any }, ctx: any) => me(),
  },
}

const schema = makeExecutableSchema({
  typeDefs: schemaConfig,
  resolvers: schemaResolvers,
})

export default schema
