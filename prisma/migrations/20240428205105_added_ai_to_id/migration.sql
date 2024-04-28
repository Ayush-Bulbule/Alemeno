-- AlterTable
CREATE SEQUENCE loan_id_seq;
ALTER TABLE "Loan" ALTER COLUMN "id" SET DEFAULT nextval('loan_id_seq');
ALTER SEQUENCE loan_id_seq OWNED BY "Loan"."id";
