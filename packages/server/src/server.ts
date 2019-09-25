import * as dotenv from 'dotenv-flow'
dotenv.config()

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'

import * as graphqlHTTP from 'express-graphql'

import oauthRouter from './oauth'
import schema from './schema'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
)

app.use('/', oauthRouter)

app.listen(3900, () => console.log('API server listening on port 3900!'))
