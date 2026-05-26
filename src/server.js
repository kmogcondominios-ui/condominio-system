require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const condominioRoutes = require("./routes/condominio.routes");
const condominoRoutes = require("./routes/condomino.routes");
const pagoRoutes =
    require("./routes/pago.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "..", "uploads")
    )
);

app.use("/api/auth", authRoutes);
app.use("/api/condominios", condominioRoutes);
app.use("/api/condominos", condominoRoutes);
app.use("/api/pagos", pagoRoutes);

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});