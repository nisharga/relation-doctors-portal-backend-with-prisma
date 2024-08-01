/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `available_doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `available_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_available_service_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "available_doctors" DROP CONSTRAINT "available_doctors_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "available_doctors" DROP CONSTRAINT "available_doctors_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_available_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_service_id_fkey";

-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_history" DROP CONSTRAINT "medical_history_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_apoointment_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_specialization_id_fkey";

-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "available_doctors";

-- DropTable
DROP TABLE "available_services";

-- DropTable
DROP TABLE "medical_history";

-- DropTable
DROP TABLE "patients";

-- DropTable
DROP TABLE "payment";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "time_slots";
