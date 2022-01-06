const { Schema, model } = require('mongoose');

const InscripcionSchema = Schema({


    proyecto_id: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: true
    },

    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: { type: String, default: "Pendiente" },
    fechaIngreso: { type: String, default: "false" },
    fechaEgreso: { type: String, default: "false" }


})
module.exports = model("Inscripcion", InscripcionSchema);