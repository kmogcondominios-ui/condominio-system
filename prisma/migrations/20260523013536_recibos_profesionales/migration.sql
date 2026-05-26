-- AlterTable
ALTER TABLE "Condomino" ADD COLUMN "departamento" TEXT;
ALTER TABLE "Condomino" ADD COLUMN "torre" TEXT;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN "folioRecibo" INTEGER;
ALTER TABLE "Pago" ADD COLUMN "metodoPago" TEXT;
ALTER TABLE "Pago" ADD COLUMN "periodo" TEXT;
ALTER TABLE "Pago" ADD COLUMN "referencia" TEXT;
