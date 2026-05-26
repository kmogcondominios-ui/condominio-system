const PDFDocument = require("pdfkit");

const path = require("path");

function generarRecibo(res, pago){

    // =====================================
    // DOCUMENTO
    // =====================================

    const doc = new PDFDocument({

        size:[612,396], // MEDIA CARTA HORIZONTAL

        margin:15

    });

    // =====================================
    // HEADERS
    // =====================================

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `inline; filename=recibo-${pago.id}.pdf`
    );

    doc.pipe(res);

    // =====================================
    // COLORES
    // =====================================

    const azul = "#0B1F3A";

    const verde = "#148A2A";

    const rojo = "#D90429";

    // =====================================
    // BORDE
    // =====================================

    doc
        .lineWidth(1)
        .rect(
            10,
            10,
            592,
            376
        )
        .stroke(azul);

    // =====================================
    // LOGO CONDOMINIO
    // =====================================

    try{

        const logoCondominio =
            path.join(
                __dirname,
                "../../uploads",
                pago.condominio.logo
            );

        doc.image(
            logoCondominio,
            20,
            18,
            {
                width:60
            }
        );

    }catch(error){

        console.log(error);

    }

    // =====================================
    // LOGO EMPRESA
    // =====================================

    try{

        const logoEmpresa =
            path.join(
                __dirname,
                "../../public/logo-empresa.png"
            );

        doc.image(
            logoEmpresa,
            450,
            15,
            {
                width:120
            }
        );

    }catch(error){

        console.log(error);

    }

    // =====================================
    // TITULO
    // =====================================

    doc
        .fillColor(azul)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text(
            "RECIBO DE PAGO",
            180,
            35
        );

    // =====================================
    // FOLIO
    // =====================================

    doc
        .fillColor(rojo)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(
            "FOLIO:",
            460,
            90
        );

    doc
        .fontSize(24)
        .text(
            String(
                pago.folioRecibo || ""
            ).padStart(6,"0"),
            505,
            80
        );

    // =====================================
    // LINEA DIVISORA
    // =====================================

    doc
        .moveTo(20,120)
        .lineTo(585,120)
        .stroke(azul);

    // =====================================
    // DATOS
    // =====================================

    const xLabel = 25;

    const xValue = 120;

    let y = 135;

    const espacio = 22;

    function fila(label, valor){

        doc
            .fillColor(azul)
            .fontSize(9)
            .font("Helvetica-Bold")
            .text(
                label,
                xLabel,
                y
            );

        doc
            .fillColor("black")
            .fontSize(9)
            .font("Helvetica")
            .text(
                valor || "",
                xValue,
                y
            );

        y += espacio;

    }

    fila(
        "CONDOMINIO:",
        pago.condominio.nombre
    );

    fila(
        "CONDÓMINO:",
        pago.condomino.nombre
    );

    fila(
        "UNIDAD:",
        `${pago.condomino.departamento || ""} ${pago.condomino.torre || ""}`
    );

    fila(
        "CONCEPTO:",
        pago.tipo
    );

    fila(
        "PERIODO:",
        pago.periodo || ""
    );

    fila(
        "MÉTODO:",
        pago.metodoPago || ""
    );

    fila(
        "REFERENCIA:",
        pago.referencia || ""
    );

    // =====================================
    // CAJA MONTO
    // =====================================

    doc
        .roundedRect(
            355,
            145,
            220,
            80,
            8
        )
        .lineWidth(2)
        .stroke(verde);

    doc
        .fillColor(verde)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(
            "MONTO PAGADO",
            418,
            152
        );

    doc
        .fillColor(verde)
        .fontSize(28)
        .font("Helvetica-Bold")
        .text(
            `$${parseFloat(
                pago.monto
            ).toFixed(2)}`,
            385,
            170,
            {
                width:170,
                align:"center"
            }
        );

    doc
    .fillColor(verde)
    .fontSize(7)
    .font("Helvetica-Bold")
    .text(
        numeroALetras(
            pago.monto
        ),
        385,
        198,
        {
            width:170,
            align:"center"
        }
    );

    // =====================================
    // FECHA
    // =====================================

    const fecha =
        new Date(
            pago.createdAt
        ).toLocaleDateString(
            "es-MX"
        );

    doc
        .fillColor("black")
        .fontSize(8)
        .font("Helvetica")
        .text(
            `Fecha: ${fecha}`,
            445,
            232
        );

    // =====================================
    // LEYENDA
    // =====================================

    const leyenda = `
ESTE RECIBO NO ES DE CARÁCTER FISCAL, YA QUE
COBRA UNA CUOTA PARA EL MANTENIMIENTO Y
CONSERVACIÓN DE ÁREASCOMUNES DE ESTE CONDOMINIO.

EL PAGO DE ESTE RECIBO SOLO SE APLICARÁ PARA EL MES
ESPECIFICADO, NO LIBERA A LA UNIDAD DE ADEUDOS.
`;

    doc
        .fillColor(azul)
        .fontSize(5.5)
        .font("Helvetica")
        .text(
            leyenda,
            25,
            285,
            {
                width:230,
                align:"justify",
                lineGap:1
            }
        );

    // =====================================
    // AGRADECIMIENTO
    // =====================================

    doc
        .fillColor(azul)
        .fontSize(8)
        .font("Helvetica-Oblique")
        .text(
            "Gracias por su puntualidad en el pago.",
            400,
            260
        );

    // =====================================
    // FIRMA
    // =====================================

    doc
        .moveTo(380,300)
        .lineTo(555,300)
        .stroke("black");

    doc
        .fillColor(azul)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(
            pago.condominio
                .administradorNombre
                || "Administración",
            430,
            308
        );

    doc
        .fontSize(8)
        .font("Helvetica")
        .text(
            pago.condominio
                .administradorCargo
                || "",
            420,
            322
        );

    // =====================================
    // FINALIZAR
    // =====================================

    doc.end();

}

function numeroALetras(numero){

    numero = parseFloat(numero);

    const unidades = [
        "",
        "UN",
        "DOS",
        "TRES",
        "CUATRO",
        "CINCO",
        "SEIS",
        "SIETE",
        "OCHO",
        "NUEVE"
    ];

    const decenas = [
        "",
        "DIEZ",
        "VEINTE",
        "TREINTA",
        "CUARENTA",
        "CINCUENTA",
        "SESENTA",
        "SETENTA",
        "OCHENTA",
        "NOVENTA"
    ];

    const especiales = [
        "DIEZ",
        "ONCE",
        "DOCE",
        "TRECE",
        "CATORCE",
        "QUINCE",
        "DIECISÉIS",
        "DIECISIETE",
        "DIECIOCHO",
        "DIECINUEVE"
    ];

    function convertir(n){

        if(n < 10){

            return unidades[n];

        }

        if(n >= 10 && n < 20){

            return especiales[n - 10];

        }

        if(n >= 20 && n < 100){

            const d =
                Math.floor(n / 10);

            const u =
                n % 10;

            if(u === 0){

                return decenas[d];

            }

            if(d === 2){

                return "VEINTI" +
                    unidades[u].toLowerCase();

            }

            return (
                decenas[d] +
                " Y " +
                unidades[u]
            );

        }

        if(n >= 100 && n < 1000){

            const c =
                Math.floor(n / 100);

            const resto =
                n % 100;

            const centenas = [
                "",
                "CIENTO",
                "DOSCIENTOS",
                "TRESCIENTOS",
                "CUATROCIENTOS",
                "QUINIENTOS",
                "SEISCIENTOS",
                "SETECIENTOS",
                "OCHOCIENTOS",
                "NOVECIENTOS"
            ];

            if(n === 100){

                return "CIEN";

            }

            return (
                centenas[c] +
                " " +
                convertir(resto)
            );

        }

        if(n >= 1000 && n < 1000000){

            const miles =
                Math.floor(n / 1000);

            const resto =
                n % 1000;

            let texto = "";

            if(miles === 1){

                texto = "MIL";

            }else{

                texto =
                    convertir(miles) +
                    " MIL";

            }

            if(resto > 0){

                texto +=
                    " " +
                    convertir(resto);

            }

            return texto;

        }

        return n.toString();

    }

    const enteros =
        Math.floor(numero);

    const centavos =
        Math.round(
            (numero - enteros) * 100
        );

    return `
${convertir(enteros)} PESOS
${centavos
    .toString()
    .padStart(2,"0")}/100 M.N.
`;

}

module.exports =
    generarRecibo;