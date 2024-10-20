"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const typeorm_1 = require("typeorm");
const Photo_1 = require("./entities/Photo");
const Spell_1 = require("./entities/Spell");
const type_graphql_1 = require("type-graphql");
const photo_1 = require("./resolvers/photo");
const spell_1 = require("./resolvers/spell");
const errorFormatter_1 = require("./lib/errorFormatter");
const main = async () => {
    const AppDataSource = new typeorm_1.DataSource({
        type: "postgres",
        host: "localhost",
        database: "adnd",
        username: "postgres",
        password: "postgres",
        logging: true,
        synchronize: true,
        entities: [Photo_1.Photo, Spell_1.Spell],
    });
    await AppDataSource.initialize()
        .then(() => console.log("Database connection established"))
        .catch((err) => console.log(err));
    const server = new server_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [photo_1.HelloResolver, spell_1.SpellResolver],
            validate: { forbidUnknownValues: false }
        }),
        formatError: errorFormatter_1.errorFormatter,
    });
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
};
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map