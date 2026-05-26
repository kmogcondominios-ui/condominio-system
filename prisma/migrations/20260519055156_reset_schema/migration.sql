/*
  Warnings:

  - You are about to drop the column `concepto` on the `Adeudo` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Adeudo` table. All the data in the column will be lost.
  - You are about to drop the column `pagado` on the `Adeudo` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Condominio` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `Condomino` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Egreso` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Egreso` table. All the data in the column will be lost.
  - You are about to drop the column `proveedorId` on the `Egreso` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Inventario` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Proveedor` table. All the data in the column will be lost.
  - Added the required column `condominioId` to the `Adeudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `Adeudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `concepto` to the `Egreso` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adeudo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominoId" INTEGER NOT NULL,
    "condominioId" INTEGER NOT NULL,
    CONSTRAINT "Adeudo_condominoId_fkey" FOREIGN KEY ("condominoId") REFERENCES "Condomino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Adeudo_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Adeudo" ("condominoId", "id", "monto") SELECT "condominoId", "id", "monto" FROM "Adeudo";
DROP TABLE "Adeudo";
ALTER TABLE "new_Adeudo" RENAME TO "Adeudo";
CREATE TABLE "new_Condominio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "logo" TEXT
);
INSERT INTO "new_Condominio" ("direccion", "id", "logo", "nombre", "telefono") SELECT "direccion", "id", "logo", "nombre", "telefono" FROM "Condominio";
DROP TABLE "Condominio";
ALTER TABLE "new_Condominio" RENAME TO "Condominio";
CREATE TABLE "new_Condomino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "vivienda" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominioId" INTEGER NOT NULL,
    CONSTRAINT "Condomino_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Condomino" ("condominioId", "correo", "createdAt", "id", "nombre", "telefono", "vivienda") SELECT "condominioId", "correo", "createdAt", "id", "nombre", "telefono", "vivienda" FROM "Condomino";
DROP TABLE "Condomino";
ALTER TABLE "new_Condomino" RENAME TO "Condomino";
CREATE TABLE "new_Egreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "concepto" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominioId" INTEGER NOT NULL,
    CONSTRAINT "Egreso_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Egreso" ("condominioId", "id", "monto") SELECT "condominioId", "id", "monto" FROM "Egreso";
DROP TABLE "Egreso";
ALTER TABLE "new_Egreso" RENAME TO "Egreso";
CREATE TABLE "new_Inventario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominioId" INTEGER NOT NULL,
    CONSTRAINT "Inventario_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inventario" ("cantidad", "condominioId", "createdAt", "id", "nombre") SELECT "cantidad", "condominioId", "createdAt", "id", "nombre" FROM "Inventario";
DROP TABLE "Inventario";
ALTER TABLE "new_Inventario" RENAME TO "Inventario";
CREATE TABLE "new_Pago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "descripcion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominoId" INTEGER NOT NULL,
    "condominioId" INTEGER NOT NULL,
    CONSTRAINT "Pago_condominoId_fkey" FOREIGN KEY ("condominoId") REFERENCES "Condomino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pago_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pago" ("condominioId", "condominoId", "descripcion", "id", "monto", "tipo") SELECT "condominioId", "condominoId", "descripcion", "id", "monto", "tipo" FROM "Pago";
DROP TABLE "Pago";
ALTER TABLE "new_Pago" RENAME TO "Pago";
CREATE TABLE "new_Proveedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "tipo" TEXT NOT NULL,
    "condominioId" INTEGER NOT NULL,
    CONSTRAINT "Proveedor_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Proveedor" ("condominioId", "correo", "id", "nombre", "telefono", "tipo") SELECT "condominioId", "correo", "id", "nombre", "telefono", "tipo" FROM "Proveedor";
DROP TABLE "Proveedor";
ALTER TABLE "new_Proveedor" RENAME TO "Proveedor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
