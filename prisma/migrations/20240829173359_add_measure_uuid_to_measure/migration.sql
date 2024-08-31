/*
  Warnings:

  - Added the required column `measure_uuid` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Measure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "measure_uuid" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" DATETIME NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmed_value" INTEGER
);
INSERT INTO "new_Measure" ("customer_code", "has_confirmed", "id", "image_url", "measure_datetime", "measure_type", "measure_value") SELECT "customer_code", "has_confirmed", "id", "image_url", "measure_datetime", "measure_type", "measure_value" FROM "Measure";
DROP TABLE "Measure";
ALTER TABLE "new_Measure" RENAME TO "Measure";
CREATE UNIQUE INDEX "Measure_measure_uuid_key" ON "Measure"("measure_uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
