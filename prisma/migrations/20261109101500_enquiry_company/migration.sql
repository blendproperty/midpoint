-- Nullable for historical records and non-form contact imports. New public enquiries require a validated company.
ALTER TABLE "Contact" ADD COLUMN "company" TEXT;
ALTER TABLE "Enquiry" ADD COLUMN "company" TEXT;
