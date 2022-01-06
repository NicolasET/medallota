const Inscripcion = require('../models/Inscripcion');
const Avance = require('../models/Avance');
const Proyecto = require('../models/Proyecto');
const { generarJwt } = require('../helpers/jwt');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');



const resolvers = {
  Query: {
    async login(_, { email, password }) {
      const usuario = await Usuario.findOne({
        email,
      });

      if (!usuario) {
        return "Usuario o contraseña incorrecta";
      }

      const validarPassword = bcrypt.compareSync(password, usuario.password);

      if (usuario.estado === "Autorizado") {

        if (validarPassword) {
          const token = await generarJwt(usuario.id, usuario.nombre, usuario.rol);
          return {
            token,
            id: usuario.id,
            rol: usuario.rol,
            nombre: usuario.nombre
          }
        } else {
          throw new Error("Usuario o contraseña incorrecta");
        }

      } else {
        return "Usuario no autorizado - Comuniquese con el admin"
      }
    },

    async proyectos(_, args, context) {
      if (context.user.auth && (context.user.rol === "Administrador")
      ) {
        return await Proyecto.find().populate("lider");

      } else if (context.user.auth && (context.user.rol === "Lider")) {
        return await Proyecto.find({ lider: context.user.id }).populate("lider");

      } else if (context.user.auth && (context.user.rol === "Estudiante")) {
        return await Proyecto.find({ estado: true }).populate("lider");

      } else {
        return null;
      }
    },

    async misProyectos(_, args, context) {
      if (context.user.auth && (context.user.rol === "Estudiante")) {


        const inscripcion = await Inscripcion.find({ usuario_id: context.user.id, estado: "Aceptada" });
        let misP = [];
        inscripcion.forEach(element => {
          misP.push(Proyecto.findById(element.proyecto_id));

        });

        console.log(misP);

        return misP;

        // Inscripcion.find({ usuario_id: context.user.id, estado: "Aceptada" }).forEach(element => {
        //   let misProyectos = Proyecto.findById(element.proyecto_id);
        //   misProyectos = misProyectos.append(misProyectos)
        // });

        // console.log(this.misProyectos);

      } else {
        return null;
      }
    },

    async proyectoById(_, { id }, context) {
      if (context.user.auth && ((context.user.rol === "Administrador") || (context.user.rol === "Lider"))) {
        return await Proyecto.findById(id).populate("lider");
      } else {
        return null;
      }
    },

    async Usuarios(_, args, context) {
      if (context.user.auth && context.user.rol === "Administrador") {
        return await Usuario.find();
      } else if (context.user.auth && context.user.rol === "Lider") {
        return await Usuario.find({ rol: "Estudiante" });
      } else {
        return null;
      }
    },

    async usuarioById(_, { id }, context) {
      if (context.user.auth) {
        return await Usuario.findById(id);
      } else {
        return null;
      }
    },

    async Inscripciones(_, args, context) {
      if (context.user.auth && context.user.rol === "Lider") {
        return await Inscripcion.find().populate("usuario_id").populate("proyecto_id");
      } else {
        return null;
      }
    },

    async inscripcionById(_, { id }, context) {
      if (context.user.auth && context.user.rol === "Lider") {
        return await Inscripcion.findById(id).populate("usuario_id").populate("proyecto_id");
      } else {
        return null;
      }
    },

    //Historia de usuario 17

    async informacionProyectoLider(_, { id }, context) {
      console.log(context);
      if (context.user.auth) {
        if (context.user.rol === "Lider") {
          return await Proyecto.findById(id).populate("avances");
        } else {
          return null;
        }
      } else {
        return null;
      }
    },

    //Historia usuario 23
    async listaAvances(_, { idProyecto }, context) {
      if (context.user.auth && ((context.user.rol === "Estudiante") || (context.user.rol === "Lider"))) {
        return await Avance.find({ proyecto_id: idProyecto }).populate("usuario_id");
      } else {
        return null;
      }
    },
  },

  Mutation: {
    async agregarUsuario(_, { input }) {
      // No es necesario desestructurar ya que el objeto "input" ya viene armado con los
      // atributos requeridos

      const salt = bcrypt.genSaltSync();

      // Se debe usar let en lugar const, debido a que el const no se puede reasignar
      let usuario = new Usuario(input);
      usuario.password = bcrypt.hashSync(usuario.password, salt);

      return await usuario.save();
    },

    async agregarProyecto(_, { input }, context) {
      if (context.user.auth && context.user.rol === "Lider") {
        const proyecto = new Proyecto(input);

        return await proyecto.save();
      } else {
        return null;
      }
    },

    async actualizarInfoProyecto(parent, args, context) {
      if (context.user.auth && context.user.rol === "Administrador") {
        const proyecto = await Proyecto.findById(args.id);
        if (args.estado === true && proyecto.fase === null) {
          return await Proyecto.findByIdAndUpdate(
            args.id,
            {
              estado: args.estado,
              fase: "Iniciado",
              fechaInicio: Date.now()
            },
            { new: true }
          );

        } else if (args.fase === "Terminado") {
          return await Proyecto.findByIdAndUpdate(
            args.id,
            {
              estado: false,
              fase: "Terminado",
              fechaFin: Date.now()
            },
            { new: true }
          );

        } else if (args.fase != "Terminado") {
          return await Proyecto.findByIdAndUpdate(
            args.id,
            {
              fase: args.fase,
              estado: args.estado
            },
            { new: true }
          );

        }

      } else if (context.user.auth && context.user.rol === "Lider") {
        const proyecto = await Proyecto.findById(args.id);
        if (args.fase === "Terminado") {
          return await Proyecto.findByIdAndUpdate(
            args.id,
            {
              nombre: args.nombre,
              objetivosG: args.objetivosG,
              objetivosE: args.objetivosE,
              presupuesto: args.presupuesto,
              estado: false,
              fase: "Terminado",
              fechaFin: Date.now()
            },
            { new: true }
          );
        } else if (proyecto.fase != "Terminado") {
          return await Proyecto.findByIdAndUpdate(args.id, {
            nombre: args.nombre,
            objetivosG: args.objetivosG,
            objetivosE: args.objetivosE,
            presupuesto: args.presupuesto,
            estado: args.estado,
            fase: args.fase
          },
            { new: true }
          );
        }

      } else {
        return null;
      }
    },

    async actualizarUsuario(parent, args, context) {
      if (context.user.auth) {
        const salt = bcrypt.genSaltSync();
        args.password = bcrypt.hashSync(args.password, salt);
        return await Usuario.findByIdAndUpdate(
          args.id,
          {
            nombre: args.nombre,
            cc: args.cc,
            password: args.password

          },
          { new: true }
        );
      } else {
        return null;
      }
    },

    async agregarInscripcion(parent, { input }, context) {
      if (context.user.auth && context.user.rol === "Estudiante") {

        const proyecto = await Proyecto.findById(input.proyecto_id);

        if (proyecto.estado === true) {
          const inscripcion = new Inscripcion(input);
          return await inscripcion.save();
        } else {
          return null;
        }
      } else {
        return null;
      }
    },

    async actualizarEstadoInscripcion(parent, args, context) {
      if (context.user.auth && context.user.rol === "Lider") {
        const inscripcion = await Inscripcion.findById(args.id);

        return await Inscripcion.findByIdAndUpdate(
          args.id,
          {
            estado: args.estado,
            fechaIngreso: Date.now()
          },
          { new: true }
        );
      } else {
        return null;
      }
    },

    async actualizarEstadoUser(parent, args, context) {
      if (context.user.auth && (context.user.rol === "Administrador" || context.user.rol == "Lider")) {
        return await Usuario.findByIdAndUpdate(
          args.id,
          { estado: args.estado },
          { new: true }
        );
      } else {
        return null;
      }
    },

    //Historia de usuario 18
    async agregarObservacion(_, { idAvance, observacion, idProyecto }, context) {
      if (context.user.auth && context.user.rol === "Lider") {
        const proyecto = await Proyecto.findById(idProyecto);
        if (proyecto.estado === true && proyecto.fase != "Terminado") {
          let { observaciones } = await Avance.findById(idAvance);
          let inObservacion = {
            observacion: observacion,
            fechaObservacion: Date.now()
          };
          let nObservacion = [...observaciones, inObservacion];
          return await Avance.findByIdAndUpdate(
            idAvance,
            { observaciones: nObservacion },
            { new: true }
          );
        }
      }
    },
    //Historia de usuario 22
    async agregarAvance(_, { idProyecto, avance }, context) {
      if (context.user.auth && context.user.rol === "Estudiante") {

        const proyecto = await Proyecto.findById(idProyecto);
        const inscripcion = await Inscripcion.findOne({ proyecto_id: idProyecto, estado: "Aceptada" });

        if ((proyecto.estado === true) && (proyecto.fase != "Terminado") && (inscripcion)
          && (inscripcion.fechaEgreso === "false")) {
          let inAvance = {
            proyecto_id: idProyecto,
            usuario_id: context.user.id,
            fechaAvance: Date.now(),
            avanceEstudiante: avance,
          };
          let nuevoAvance = new Avance(inAvance);
          let { _id } = await nuevoAvance.save();
          console.log(_id);
          if (_id) {
            let { avances } = await Proyecto.findById(idProyecto);
            let nAvances = [...avances, _id];
            return await Proyecto.findByIdAndUpdate(
              idProyecto,
              {
                avances: nAvances,
                fase: "En desarrollo"
              },
              { new: true }
            ).populate("avances");
          }
        } else {
          return "No está autorizado para agregar avances";
        }
      } else {
        return "No está autorizado para agregar avances";
      }
    },

    //Historia usuario 23
    async actualizarAvance(_, { idAvance, avance }, context) {
      if (context.user.auth && context.user.rol === "Estudiante") {
        const avance = await Avance.findById(idAvance);
        const proyecto = await Proyecto.findById(avance.proyecto_id);
        const inscripcion = await Inscripcion.findOne({
          proyecto_id: avance.proyecto_id,
          estado: "Aceptada"
        });

        if ((proyecto.estado === true) && (proyecto.fase != "Terminado") && (inscripcion) && (inscripcion.fechaEgreso === "false")) {
          let inAvance = {
            usuario_id: context.user.id,
            fechaAvance: Date.now(),
            avanceEstudiante: avance,
          };
          return await Avance.findByIdAndUpdate(idAvance, inAvance, { new: true });

        } else {
          return "No está autorizado para agregar avances";
        }
      } else {
        return "No está autorizado para agregar avances";
      }
    },
  },
};

module.exports = {
  resolvers
}