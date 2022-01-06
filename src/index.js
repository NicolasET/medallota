const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { dbConnection } = require('./database/config');
const schema = require('./graphql/schema');
const { validarJwt } = require('./middleware/validar-jwt');
const dotenv = require("dotenv");
const cors = require('cors');

const app = express();
dotenv.config();

dbConnection();

app.use(cors());

app.use(express.static('public'));

app.use(validarJwt);

app.listen(process.env.PORT || 4000, () => {
    console.log(`Servidor en el puerto ${process.env.PORT || 4000}`);
});

// app.use se utiliza para llamar middlewares lo cuales tienen el comando next() después de ejecutarse
app.use("/graphql", graphqlHTTP((req) => ({
    graphiql: true,
    schema: schema,
    context: {
        user: req.user
    }
})));

// app.get("/", (req, res) => {
//     res.json({
//         ok: true,
//         msg: "Funcionando"
//     });
// });