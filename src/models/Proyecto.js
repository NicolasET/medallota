const { Schema, model } = require('mongoose');

const ProyectoSchema = Schema({
  nombre: { type: String, required: true },
  objetivosG: [
    {
      type: String,
      required: true,
    },
  ],
  objetivosE: [
    {
      type: String,
      required: true,
    },
  ],
  presupuesto: { type: Number, required: true },
  fechaInicio: { type: String, default: "" },
  fechaFin: { type: String, default: "" },
  lider: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  estado: { type: Boolean, default: false },
  fase: { type: String, default: null },
  avances: [
    {
      type: Schema.Types.ObjectId,
      ref: "Avance",
      required: true,
    },
  ],
});
module.exports = model("Proyecto", ProyectoSchema);
