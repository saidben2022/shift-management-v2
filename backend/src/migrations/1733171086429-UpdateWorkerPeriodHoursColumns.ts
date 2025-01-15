import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkerPeriodHoursColumns1733171086429 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "worker_period_hours" 
            MODIFY COLUMN "maxHours" FLOAT NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "worker_period_hours" 
            MODIFY COLUMN "maxHours" INTEGER NOT NULL;
        `);
    }
}
