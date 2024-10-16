import "reflect-metadata"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { DataSource } from "typeorm"
import { Photo } from "./entities/Photo"
import { Spell } from "./entities/Spell"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/photo"
import { SpellResolver } from "./resolvers/spell"

// opasdfpaosdfk

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
    entities: [Photo, Spell],
  })

  await AppDataSource.initialize()
    .then(() => console.log("Database connection established"))
    .catch((err) => console.log(err))

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, SpellResolver],
    }),
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })

  console.log(`🚀  Server ready at: ${url}`)
}

main().catch((err) => console.log(err))
