/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Context` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Context_userId_name_key" ON "Context"("userId", "name");
