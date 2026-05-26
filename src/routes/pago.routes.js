const express = require("express");

const router = express.Router();

const prisma = require("../config/prisma");

const auth = require("../middleware/auth");

const generarRecibo =
    require("../pdf/recibo");

router.get("/", auth, async (req, res) => {

    const data = await prisma.pago.findMany({
        include:{
            condominio:true,
            condomino:true
        },
        orderBy:{
            id:"desc"
        }
    });

    res.json(data);

});

router.post("/", auth, async (req, res) => {

    try{

        const {

            tipo,
            monto,
            descripcion,
            metodoPago,
            periodo,
            condominioId,
            condominoId

        } = req.body;

        const condominio =
            await prisma.condominio.findUnique({

                where:{
                    id: parseInt(condominioId)
                }

            });

        const folioRecibo =
            condominio.folioActual;

        const condomino =
            await prisma.condomino.findUnique({

                where:{
                    id: parseInt(condominoId)
                }

            });

        const fecha =
            new Date();

        const mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2,"0");

        const anio =
            fecha
                .getFullYear()
                .toString()
                .slice(-2);

        const referencia =
            `MTTO-${
                condomino.departamento || "SN"
            }-${mes}${anio}`;

        let restante =
            parseFloat(monto);

        const cuotasPendientes =
            await prisma.cuotaMensual.findMany({

                where:{

                    condominoId:
                        parseInt(condominoId),

                    pagado:false

                },

                orderBy:{
                    createdAt:"asc"
                }

            });

        for(const cuota of cuotasPendientes){

            if(restante <= 0)
                break;

            const saldoActual =
                cuota.saldoPendiente;

            // LIQUIDA CUOTA COMPLETA
            if(restante >= saldoActual){

                restante -= saldoActual;

                await prisma.cuotaMensual.update({

                    where:{
                        id: cuota.id
                    },

                    data:{

                        saldoPendiente:0,

                        pagado:true,

                        fechaPago:new Date()

                    }

                });

            }

            // PAGO PARCIAL
            else{

                await prisma.cuotaMensual.update({

                    where:{
                        id: cuota.id
                    },

                    data:{

                        saldoPendiente:
                            saldoActual - restante

                    }

                });

                restante = 0;

            }

        }

        // SALDO A FAVOR
        if(restante > 0){

            await prisma.condomino.update({

                where:{
                    id: parseInt(condominoId)
                },

                data:{
                    saldoFavor:{
                        increment: restante
                    }
                }

            });

        }

        // CREAR PAGO
        const nuevo =
            await prisma.pago.create({

            data:{

                tipo,

                monto:
                    parseFloat(monto),

                descripcion,

                metodoPago,

                referencia,

                periodo,

                folioRecibo,

                condominio:{
                    connect:{
                        id: parseInt(condominioId)
                    }
                },

                condomino:{
                    connect:{
                        id: parseInt(condominoId)
                    }
                }

            }

        });

        // ACTUALIZAR FOLIO
        await prisma.condominio.update({

            where:{
                id: parseInt(condominioId)
            },

            data:{
                folioActual:
                    folioRecibo + 1
            }

        });

        res.json(nuevo);

    }catch(error){

        console.log(error);

        res.status(500).json(error);

    }

});

router.put("/:id", auth, async (req, res) => {

    const id = parseInt(req.params.id);

    const {
        tipo,
        monto,
        descripcion,
        metodoPago,
        referencia,
        periodo,
        condominioId,
        condominoId
    } = req.body;

    const actualizado =
        await prisma.pago.update({
            where:{ id },
            data:{
                tipo,
                monto: parseFloat(monto),
                descripcion,
                metodoPago,
                referencia,
                periodo,

                condominio:{
                    connect:{
                        id: parseInt(condominioId)
                    }
                },

                condomino:{
                    connect:{
                        id: parseInt(condominoId)
                    }
                }

            }
        });

    res.json(actualizado);

});

router.delete("/:id", auth, async (req, res) => {

    const id = parseInt(req.params.id);

    await prisma.pago.delete({
        where:{ id }
    });

    res.json({
        message:"Pago eliminado"
    });

});

router.get(
    "/:id/recibo",
    auth,
    async (req, res) => {

        const id =
            parseInt(req.params.id);

        const pago =
            await prisma.pago.findUnique({

                where:{ id },

                include:{
                    condominio:true,
                    condomino:true
                }

            });

        if(!pago){

            return res.status(404)
                .json({
                    error:"Pago no encontrado"
                });

        }

        generarRecibo(res, pago);

    }
);

module.exports = router;