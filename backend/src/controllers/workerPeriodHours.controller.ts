import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { WorkerPeriodHours } from '../entities/WorkerPeriodHours';
import { Between } from 'typeorm';

const workerPeriodHoursRepository = AppDataSource.getRepository(WorkerPeriodHours);

export const setWorkerPeriodHours = async (req: Request, res: Response) => {
    try {
        const { workerId, periodStart, periodEnd, maxHours } = req.body;
        console.log('Received request:', { workerId, periodStart, periodEnd, maxHours });

        if (!workerId || !periodStart || !periodEnd || maxHours === undefined) {
            return res.status(400).json({
                message: 'Missing required fields: workerId, periodStart, periodEnd, maxHours'
            });
        }

        const workerIdNum = Number(workerId);
        const maxHoursNum = Number(maxHours);
        
        // Parse dates and extract only the date part (YYYY-MM-DD)
        const startDate = new Date(periodStart);
        const endDate = new Date(periodEnd);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid dates provided' });
        }

        // Convert to YYYY-MM-DD format
        const periodStartDate = startDate.toISOString().split('T')[0];
        const periodEndDate = endDate.toISOString().split('T')[0];

        console.log('Setting worker period hours:', {
            workerId: workerIdNum,
            maxHours: maxHoursNum,
            startDate: periodStartDate,
            endDate: periodEndDate
        });

        // First, try to find any existing records for this worker and period
        const existingRecords = await workerPeriodHoursRepository
            .createQueryBuilder('wph')
            .where('wph.workerId = :workerId', { workerId: workerIdNum })
            .andWhere('date(wph.periodStart) = :periodStart', { periodStart: periodStartDate })
            .andWhere('date(wph.periodEnd) = :periodEnd', { periodEnd: periodEndDate })
            .getMany();

        console.log('Found existing records:', existingRecords);

        // Delete any existing records for this period
        if (existingRecords.length > 0) {
            await workerPeriodHoursRepository
                .createQueryBuilder()
                .delete()
                .where('workerId = :workerId', { workerId: workerIdNum })
                .andWhere('date(periodStart) = :periodStart', { periodStart: periodStartDate })
                .andWhere('date(periodEnd) = :periodEnd', { periodEnd: periodEndDate })
                .execute();
        }

        // Create new record using QueryBuilder
        try {
            const result = await workerPeriodHoursRepository
                .createQueryBuilder()
                .insert()
                .into(WorkerPeriodHours)
                .values({
                    workerId: workerIdNum,
                    maxHours: maxHoursNum,
                    periodStart: periodStartDate,
                    periodEnd: periodEndDate
                })
                .execute();

            const savedRecord = await workerPeriodHoursRepository.findOne({
                where: { id: result.identifiers[0].id }
            });

            console.log('Created new record:', savedRecord);
            return res.status(201).json(savedRecord);
        } catch (error) {
            console.error('Error saving record:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error in setWorkerPeriodHours:', error);
        return res.status(500).json({
            message: 'Failed to set worker period hours',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getWorkerPeriodHours = async (req: Request, res: Response) => {
    try {
        const { workerId, periodStart, periodEnd } = req.query;
        
        if (!workerId || !periodStart || !periodEnd) {
            return res.status(400).json({ message: 'workerId, periodStart, and periodEnd are required' });
        }

        // Parse dates and extract only the date part (YYYY-MM-DD)
        const startDate = new Date(periodStart as string);
        const endDate = new Date(periodEnd as string);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid dates provided' });
        }

        // Convert to YYYY-MM-DD format
        const periodStartDate = startDate.toISOString().split('T')[0];
        const periodEndDate = endDate.toISOString().split('T')[0];

        console.log('Getting worker period hours:', {
            workerId,
            periodStart,
            periodEnd,
            startDate: periodStartDate,
            endDate: periodEndDate
        });

        // Find record that matches the period exactly
        const records = await workerPeriodHoursRepository
            .createQueryBuilder('wph')
            .where('wph.workerId = :workerId', { workerId: Number(workerId) })
            .andWhere('date(wph.periodStart) = :periodStart', { periodStart: periodStartDate })
            .andWhere('date(wph.periodEnd) = :periodEnd', { periodEnd: periodEndDate })
            .getMany();

        console.log('Found records:', records);
        
        if (records.length > 0) {
            // If multiple records found, use the most recent one
            const mostRecent = records.reduce((latest, current) => 
                latest.updatedAt > current.updatedAt ? latest : current
            );
            return res.json({ maxHours: mostRecent.maxHours });
        }

        return res.json({ maxHours: 0 });

    } catch (error) {
        console.error('Error getting worker period hours:', error);
        return res.status(500).json({
            message: 'Error getting worker period hours',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const clearWorkerPeriodHours = async (req: Request, res: Response) => {
    try {
        const { workerId, periodStart, periodEnd } = req.query;
        
        if (!workerId || !periodStart || !periodEnd) {
            return res.status(400).json({ message: 'workerId, periodStart, and periodEnd are required' });
        }

        // Parse dates and extract only the date part (YYYY-MM-DD)
        const startDate = new Date(periodStart as string);
        const endDate = new Date(periodEnd as string);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid dates provided' });
        }

        // Convert to YYYY-MM-DD format
        const periodStartDate = startDate.toISOString().split('T')[0];
        const periodEndDate = endDate.toISOString().split('T')[0];

        // Delete records that match exactly by date (ignoring time)
        const result = await workerPeriodHoursRepository
            .createQueryBuilder()
            .delete()
            .where('workerId = :workerId', { workerId: Number(workerId) })
            .andWhere('date(periodStart) = :periodStart', { periodStart: periodStartDate })
            .andWhere('date(periodEnd) = :periodEnd', { periodEnd: periodEndDate })
            .execute();

        console.log('Deleted records:', result);
        return res.status(200).json({ message: 'Worker period hours cleared successfully' });

    } catch (error) {
        console.error('Error deleting worker period hours:', error);
        return res.status(500).json({
            message: 'Error deleting worker period hours',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
