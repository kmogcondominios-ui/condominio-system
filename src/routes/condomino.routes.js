const express = require("express");

const router = express.Router();

const prisma = require("../config/prisma");

const auth = require("../middleware/auth");

router.get(
    "/inactivos",
    auth,
    async (req,res)=>{

    const data =
        await prisma.condomino.findMany({

        where:{
            activo:false
        },

        include:{
            condominio:true
        }

    });

    res.json(data);

});

router.get("/", auth, async (req, res) => {

    const data =
        await prisma.condomino.findMany({

        where:{
            activo:true
        },

        include:{
            condominio:true
        }

    });

    res.json(data);

});

router.post("/", auth, async (req, res) => {

    const {
        nombre,
        departamento,
        torre,
        telefono,
        correo,
        condominioId
    } = req.body;

    const nuevo = await prisma.condomino.create({
        data:{
            nombre,
            departamento,
            torre,
            telefono,
            correo,
            condominioId: parseInt(condominioId)
        }   
    });

    const fecha =
    new Date();

const mes =
    String(
        fecha.getMonth() + 1
    ).padStart(2,"0");

const anio =
    fecha.getFullYear();

const periodo =
    `${mes}-${anio}`;

const condominio =
    await prisma.condominio.findUnique({

        where:{
            id: parseInt(condominioId)
        }

    });

await prisma.cuotaMensual.create({

    data:{

        periodo,

        monto:
            condominio.cuotaMensual,

        saldoPendiente:
            condominio.cuotaMensual,

        condominoId:
            nuevo.id,

        condominioId:
            parseInt(condominioId)

    }

});

    res.json(nuevo);

});

router.put("/:id", auth, async (req, res) => {

    const id = parseInt(req.params.id);

    const {
        nombre,
        departamento,
        torre,
        telefono,
        correo,
        condominioId
    } = req.body;

    const actualizado =
        await prisma.condomino.update({
            where:{ id },
            data:{
                nombre,
                departamento,
                torre,
                telefono,
                correo,
                condominioId: parseInt(condominioId)
            }
        });

    res.json(actualizado);

});

router.delete(
    "/:id",
    auth,
    async (req, res) => {

    const id =
        parseInt(req.params.id);

    await prisma.condomino.update({

        where:{ id },

        data:{
            activo:false
        }

    });

    res.json({
        message:"Desactivado"
    });

});

router.put(
    "/:id/reactivar",
    auth,
    async (req,res)=>{

    const id =
        parseInt(req.params.id);

    await prisma.condomino.update({

        where:{ id },

        data:{
            activo:true
        }

    });

    res.json({
        message:"Reactivado"
    });

});

module.exports = router;