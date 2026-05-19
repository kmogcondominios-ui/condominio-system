const express = require("express");

const prisma = require("../config/prisma");

const auth = require("../middleware/auth");
const { superadmin } = require("../middleware/roles");

const router = express.Router();

// LISTAR
router.get("/", auth, async (req, res) => {

  const data = await prisma.condominio.findMany();

  res.json(data);

});

// CREAR
router.post("/", auth, async (req, res) => {

  const {
    nombre,
    direccion,
    telefono
  } = req.body;

  const nuevo = await prisma.condominio.create({
    data: {
      nombre,
      direccion,
      telefono
    }
  });

  res.json(nuevo);

});

// EDITAR
router.put("/:id", auth, async (req, res) => {

  const id = parseInt(req.params.id);

  const actualizado = await prisma.condominio.update({
    where: { id },
    data: req.body
  });

  res.json(actualizado);

});

// ELIMINAR
router.delete("/:id",
  auth,
  superadmin,
  async (req, res) => {

    const id = parseInt(req.params.id);

    await prisma.condominio.delete({
      where: { id }
    });

    res.json({
      mensaje: "Condominio eliminado"
    });

});

module.exports = router;