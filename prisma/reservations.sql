BEGIN;

CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'CANCELLED');

CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "requestedAt" TIMESTAMP(3) NOT NULL,
  "guests" INTEGER NOT NULL,
  "notes" TEXT NOT NULL DEFAULT '',
  "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Reservation_guests_check" CHECK ("guests" BETWEEN 1 AND 99)
);

CREATE UNIQUE INDEX "Reservation_requestId_key" ON "Reservation"("requestId");
CREATE INDEX "Reservation_status_requestedAt_idx" ON "Reservation"("status", "requestedAt");
CREATE INDEX "Reservation_email_createdAt_idx" ON "Reservation"("email", "createdAt");
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;

COMMIT;
