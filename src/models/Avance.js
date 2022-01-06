const { Schema, model } = require('mongoose');

const AvanceSchema = Schema({
  proyecto_id: {
    type: Schema.Types.ObjectId,
    ref: "Proyecto",
    required: true,
  },
  usuario_id: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  fechaAvance: {
    type: String,
    default: Date.now(),
    required: true,
  },
  avanceEstudiante: {
    type: String,
    required: true,
  },
  observaciones: [
    {
      observacion: {
        type: String,
        required: true
      },
      fechaObservacion: {
        type: String,
        default: Date.now()
      }

    },
  ],
});
module.exports = model("Avance", AvanceSchema);
