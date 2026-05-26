-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Condominio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "logo" TEXT,
    "folioActual" INTEGER NOT NULL DEFAULT 1,
    "fondoInicial" REAL NOT NULL DEFAULT 0,
    "saldoInicial" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Condominio" ("direccion", "id", "logo", "nombre", "telefono") SELECT "direccion", "id", "logo", "nombre", "telefono" FROM "Condominio";
DROP TABLE "Condominio";
ALTER TABLE "new_Condominio" RENAME TO "Condominio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
