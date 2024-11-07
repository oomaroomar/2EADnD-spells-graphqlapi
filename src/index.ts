import "reflect-metadata"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4'
import { DataSource } from "typeorm"
import { Spell } from "./entities/Spell"
import { buildSchema } from "type-graphql"
import { SpellResolver } from "./resolvers/spell"
import { errorFormatter } from "./lib/errorFormatter"
import Redis from "ioredis"
import session from "express-session"
import RedisStore from 'connect-redis'
import express from 'express'
import cors from 'cors'
import { __prod__ } from "./constants"
import { User } from "./entities/User"
import { UserResolver } from "./resolvers/user"
import { SpellBook } from "./entities/SpellBook"
import { Character } from "./entities/Character"
import {SpellPage} from './entities/SpellPage'
import { CharacterResolver } from "./resolvers/character"
import { createSpellLoader } from "./utils/createSpellLoader"
import { LearnedSpell } from "./entities/LearnedSpell"
import { SpellBookResolver } from "./resolvers/spellBook"

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}


const main = async () => {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.

  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    database: "adnd",
    username: "postgres",
    password: "postgres",
    logging: true,
    // migrations: [path.join(__dirname, './migrations/*')],
    synchronize: true,
    entities: [Spell, User, SpellBook, Character, SpellPage, LearnedSpell],
  })


  const app = express()

  await AppDataSource.initialize()
    .then(() => console.log("Database connection established"))
    .catch((err) => console.log(err))

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [SpellResolver, UserResolver, CharacterResolver, SpellBookResolver],
      validate: {forbidUnknownValues: false}
    }),
    formatError: errorFormatter,
  })


  const redis = new Redis()
  const redisStore = new RedisStore({
    client: redis,
    prefix: '2e_sheet'
  })

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }))

  app.use(session({
    name: 'qid',
    store: redisStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    },
    saveUninitialized: false,
    resave: false,
    secret: 'kitty kat'
  }))

  await server.start()

  app.use('/graphql', 
    express.json(),
    expressMiddleware(server, {
      context: async ({req, res}) => ({
        req,
        res,
        redis,
        spellLoader: createSpellLoader()
      })
    })
  )

  app.listen(4000, () => console.log('🚀 Server started on http://localhost:4000/graphql'))
}

main().catch((err) => console.log(err))
