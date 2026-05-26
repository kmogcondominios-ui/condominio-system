const express = require("express");

const router = express.Router();

const prisma = require("../config/prisma");

const auth = require("../middleware/auth");

const upload = require("../config/multer");

router.get("/", auth, async (req, res) => {

    const data = await prisma.condominio.findMany();

    res.json(data);

});

router.post(
    "/",
    auth,
    upload.single("logo"),
    async (req, res) => {

    try {

        const nombre = req.body.nombre;

        const direccion = req.body.direccion;

        const telefono = req.body.telefono;

        const folioActual =
            req.body.folioActual;

        const fondoInicial =
            req.body.fondoInicial;

        const saldoInicial =
            req.body.saldoInicial;

        const administradorNombre =
            req.body.administradorNombre;

        const administradorCargo =
            req.body.administradorCargo;

        const logo = req.file
            ? req.file.filename
            : null;

        const nuevo = await prisma.condominio.create({
            data:{
                nombre,
                direccion,
                telefono,

                folioActual:
                    parseInt(folioActual || 1),

                fondoInicial:
                    parseFloat(fondoInicial || 0),

                saldoInicial:
                    parseFloat(saldoInicial || 0),

                cuotaMensual:
                    parseFloat(
                        req.body.cuotaMensual || 0
                    ),

                administradorNombre,
                administradorCargo,
                logo

    }

});

        res.json(nuevo);

    } catch(error){

        console.log(error);

        res.status(500).json(error);

    }

});

router.put(
    "/:id",
    auth,
    upload.single("logo"),
    async (req, res) => {

    const id = parseInt(req.params.id);

    const nombre = req.body.nombre;

    const direccion = req.body.direccion;

    const telefono = req.body.telefono;

    const folioActual =
        req.body.folioActual;

    const fondoInicial =
        req.body.fondoInicial;

    const saldoInicial =
        req.body.saldoInicial;

    const administradorNombre =
        req.body.administradorNombre;

    const administradorCargo =
        req.body.administradorCargo;

    const logo = req.file
    ? req.file.filename
    : undefined;

    const data = {
    nombre,
    direccion,
    telefono,

    folioActual:
        parseInt(folioActual || 1),

    fondoInicial:
        parseFloat(fondoInicial || 0),

    saldoInicial:
        parseFloat(saldoInicial || 0),

    cuotaMensual:
        parseFloat(
            req.body.cuotaMensual || 0
        ),

    administradorNombre,

    administradorCargo,

    ...(logo && { logo })

    };

    if(req.file){

        data.logo = req.file.filename;

    }

    const actualizado =
        await prisma.condominio.update({
            where:{ id },
            data
        });

    res.json(actualizado);

});

router.delete("/:id", auth, async (req, res) => {

    const id = parseInt(req.params.id);

    await prisma.condominio.delete({
        where:{ id }
    });

    res.json({
        message:"Eliminado"
    });

});

module.exports = router;