import express from 'express';
import { AppDataSource } from '../data-source';
import { WorkerPeriodHours } from '../entities/WorkerPeriodHours';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();
const workerPeriodHoursRepository = AppDataSource.getRepository(WorkerPeriodHours);

// Get worker period hours
router.get('/', auth, async (req, res) => {
  try {
    const { workerId, periodStart, periodEnd } = req.query;

    if (!workerId || !periodStart || !periodEnd) {
      console.error('Missing required parameters:', { workerId, periodStart, periodEnd });
      return res.status(400).json({ message: 'workerId, periodStart, and periodEnd are required' });
    }

    // Parse dates and ensure they are valid
    const startDate = new Date(periodStart as string);
    const endDate = new Date(periodEnd as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date format:', { periodStart, periodEnd });
      return res.status(400).json({ message: 'Invalid date format' });
    }

    console.log('Searching for period hours:', {
      workerId: parseInt(workerId as string),
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString()
    });

    // Use date() function to match dates ignoring time
    const periodHours = await workerPeriodHoursRepository
      .createQueryBuilder('wph')
      .where('wph.workerId = :workerId', { workerId: parseInt(workerId as string) })
      .andWhere('date(wph.periodStart) = date(:periodStart)', { periodStart: startDate.toISOString() })
      .andWhere('date(wph.periodEnd) = date(:periodEnd)', { periodEnd: endDate.toISOString() })
      .getOne();

    console.log('Found period hours:', periodHours);

    if (!periodHours) {
      console.log('No period hours found, returning 0');
      return res.json({ maxHours: 0 });
    }

    return res.json({ maxHours: periodHours.maxHours });
  } catch (error) {
    console.error('Error getting worker period hours:', error);
    return res.status(500).json({ message: 'Error getting worker period hours' });
  }
});

// Set worker period hours
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { workerId, periodStart, periodEnd, maxHours } = req.body;

    if (!workerId || !periodStart || !periodEnd || maxHours === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse dates and ensure they are valid
    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    console.log('Creating/updating period hours:', {
      workerId,
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString(),
      maxHours
    });

    // First, delete any existing records for this period
    await workerPeriodHoursRepository
      .createQueryBuilder()
      .delete()
      .from(WorkerPeriodHours)
      .where('workerId = :workerId', { workerId })
      .andWhere('date(periodStart) = date(:periodStart)', { periodStart: startDate.toISOString() })
      .andWhere('date(periodEnd) = date(:periodEnd)', { periodEnd: endDate.toISOString() })
      .execute();

    // Set start time to beginning of day and end time to end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Create new record
    const periodHours = workerPeriodHoursRepository.create({
      workerId: Number(workerId),
      periodStart: startDate,
      periodEnd: endDate,
      maxHours: Number(maxHours)
    });

    const savedPeriodHours = await workerPeriodHoursRepository.save(periodHours);
    console.log('Saved period hours:', savedPeriodHours);

    return res.status(201).json(savedPeriodHours);
  } catch (error) {
    console.error('Error setting worker period hours:', error);
    return res.status(500).json({ message: 'Error setting worker period hours' });
  }
});

// Update worker period hours
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { periodStart, periodEnd, maxHours } = req.body;
    const periodHours = await workerPeriodHoursRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });

    if (!periodHours) {
      return res.status(404).json({ message: 'Period hours not found' });
    }

    // Update the record
    if (periodStart) periodHours.periodStart = new Date(periodStart);
    if (periodEnd) periodHours.periodEnd = new Date(periodEnd);
    if (maxHours !== undefined) periodHours.maxHours = Number(maxHours);

    const updatedPeriodHours = await workerPeriodHoursRepository.save(periodHours);
    return res.json(updatedPeriodHours);
  } catch (error) {
    console.error('Error updating worker period hours:', error);
    return res.status(500).json({ message: 'Error updating worker period hours' });
  }
});

// Delete worker period hours
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const periodHours = await workerPeriodHoursRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });

    if (!periodHours) {
      return res.status(404).json({ message: 'Worker period hours not found' });
    }

    await workerPeriodHoursRepository.remove(periodHours);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting worker period hours:', error);
    res.status(500).json({ message: 'Error deleting worker period hours' });
  }
});

export default router;
