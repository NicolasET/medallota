const { makeExecutableSchema } = require('@graphql-tools/schema');
const { resolvers } = require('./resolvers')

const typeDefs = `

    type Query {
        login(email: String!, password: String!): Auth,
        proyectos: [Proyecto],
        misProyectos: [Proyecto],
        proyectoById(id: ID!): Proyecto,
        Inscripciones: [Inscripcion],
        inscripcionById(id: ID!): Inscripcion,
        Usuarios: [Usuario],
        usuarioById(id: ID!): Usuario,
        informacionProyectoLider(id: ID!): Proyecto,
        listaAvances(idProyecto:ID!):[Avance]
        
    }
    
    type Mutation {
        agregarUsuario(input: UsuarioInput): Usuario,

        agregarProyecto(input: ProyectoInput): Proyecto,
        agregarInscripcion(input: InscripcionInput): Inscripcion,
        actualizarUsuario(id : ID!, 
            nombre: String, 
            cc: String,
            password: String,
            ): Usuario,
        actualizarEstadoProyecto(id: ID!,
            estado: Boolean,
            fase: String): Proyecto,
        actualizarInfoProyecto(id: ID!,
            nombre: String,
            objetivosG: [String],
            objetivosE: [String],
            presupuesto: Int,
            estado: Boolean,
            fase: String): Proyecto,
       
        actualizarEstadoInscripcion(id:ID!,estado:String!): Inscripcion,
        actualizarEstadoUser(id:ID!,estado:String!):Usuario,
        agregarObservacion(idAvance: ID! , observacion: String!) : Avance,
        agregarAvance(idProyecto:ID!, avance:String!): Proyecto,
        actualizarAvance(idAvance:ID!,avance:String!): Avance     

    }

    type Auth {
        id: ID,
        nombre: String,
        token: String,
        rol: String
    }

    type Usuario {
        id: ID!,
        nombre: String,
        email: String,
        cc: String,
        password: String,
        rol: String,
        estado: String
    }

    type Observacion{
        observacion:String,
        fechaObservacion: String
     }
     
    type Avance {
         id: ID,
         proyecto_id: ID,
         usuario_id: Usuario,
         fechaAvance: String,
         avanceEstudiante: String,
         observaciones: [Observacion]   
    }

   
    type Proyecto {
        id: ID,
        nombre: String,
        objetivosG: [String],
        objetivosE: [String],
        presupuesto: Int,
        fechaInicio: String,
        fechaFin: String,
        lider: Usuario,
        estado: Boolean,
        fase: String      
        avances: [Avance]


    }

    type AvanceEstudiante{
        avanceEstudiante: ID!
    }
  
    input UsuarioInput {
        nombre: String,
        email: String,
        cc: String,
        password: String,
        rol: String
    }

    input ProyectoInput {
        nombre: String,
        objetivosG: [String],
        objetivosE: [String],
        presupuesto: Int,
        lider: ID
    }

    input ObservacionInput{
        observacion: String!,
        fechaObservacion: String

    }
   
    type Inscripcion {
        id: ID,
        proyecto_id: Proyecto,
        usuario_id: Usuario,
        estado: String,
        fechaIngreso: String,
        fechaEgreso: String 
    }

    input InscripcionInput {
        proyecto_id: ID,
        usuario_id: ID
    }

`;

module.exports = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
