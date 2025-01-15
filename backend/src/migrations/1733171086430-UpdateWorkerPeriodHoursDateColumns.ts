import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkerPeriodHoursDateColumns1733171086430 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First modify maxHours to float
        await queryRunner.query(`
            ALTER TABLE "worker_period_hours" 
            MODIFY COLUMN "maxHours" FLOAT NOT NULL;
        `);

        // Then modify date columns
        await queryRunner.query(`
            ALTER TABLE "worker_period_hours" 
            MODIFY COLUMN "periodStart" DATE NOT NULL,
            MODIFY COLUMN "periodEnd" DATE NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // First revert date columns
        await queryRunner.query(`
            ALTER TABLE "worker_period_hours" 
            MODIFY COLUMN "periodStart" DATETIME NOT NULL,
            MODIFY COLUMN "periodEnd" DATETIME NOT NULL;
        `);

        // Then revert maxHours to integer
        await queryRunner.query(`
            ALTER TABLE "worker_period_hours" 
            MODIFY COLUMN "maxHours" INTEGER NOT NULL;
        `);
    }
}
