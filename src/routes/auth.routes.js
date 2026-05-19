const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");

const router = express.Router();

const SECRET = "SUPER_SECRET_KEY";

// REGISTRO
router.post("/register", async (req, res) => {
  try {

    const {
      nombre,
      correo,
      password,
      rol
    } = req.body;

    const existe = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (existe) {
      return res.status(400).json({
        error: "Correo ya registrado"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: hash,
        rol
      }
    });

    res.json(usuario);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { correo, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    const valid = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!valid) {
      return res.status(401).json({
        error: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      SECRET
    );

    res.json({
      token,
      usuario
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

});

module.exports = router;