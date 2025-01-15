import express from 'express';
import { Between, In } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Shift, ShiftType } from '../entities/Shift';
import { Worker } from '../entities/Worker';
import { WorkerPeriodHours } from '../entities/WorkerPeriodHours';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();
const shiftRepository = AppDataSource.getRepository(Shift);
const workerRepository = AppDataSource.getRepository(Worker);
const periodHoursRepository = AppDataSource.getRepository(WorkerPeriodHours);

// Helper function to calculate hours worked
const calculateHoursWorked = (startTime: Date, endTime: Date): number => {
  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  return Number(hours.toFixed(2));
};

// Helper function to check if shift type is a leave type
const isLeaveType = (shiftType: ShiftType): boolean => {
  return [ShiftType.VACATION, ShiftType.SICK_LEAVE, ShiftType.UNPAID_LEAVE].includes(shiftType);
};

// Get all shifts
router.get('/', auth, async (req, res) => {
  try {
    const shifts = await shiftRepository.find({
      relations: ['worker'],
      order: { startTime: 'DESC' }
    });
    res.json(shifts || []);
  } catch (error: any) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ 
      message: 'Error fetching shifts', 
      error: error?.message || 'Unknown error' 
    });
  }
});

// Get shifts for a specific worker
router.get('/worker/:workerId', auth, async (req, res) => {
  try {
    const shifts = await shiftRepository.find({
      where: { worker: { id: parseInt(req.params.workerId) } },
      relations: ['worker'],
      order: { startTime: 'DESC' }
    });
    res.json(shifts || []);
  } catch (error: any) {
    console.error('Error fetching worker shifts:', error);
    res.status(500).json({ 
      message: 'Error fetching worker shifts', 
      error: error?.message || 'Unknown error' 
    });
  }
});

// Get shifts within a date range
router.get('/range', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const shifts = await shiftRepository.find({
      where: {
        startTime: Between(new Date(start as string), new Date(end as string))
      },
      relations: ['worker'],
      order: { startTime: 'ASC' }
    });
    res.json(shifts || []);
  } catch (error: any) {
    console.error('Error fetching shifts in range:', error);
    res.status(500).json({ 
      message: 'Error fetching shifts in range', 
      error: error?.message || 'Unknown error' 
    });
  }
});

// Get current day worker status
router.get('/current-day-status', auth, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Get all workers
    const workers = await workerRepository.find();
    
    // Get all shifts for today
    const todayShifts = await shiftRepository.find({
      where: {
        startTime: Between(startOfDay, endOfDay)
      },
      relations: ['worker']
    }) || [];

    // Prepare worker status map
    const workerStatus = workers.map(worker => {
      const workerShift = todayShifts.find(shift => shift.worker?.id === worker.id);
      
      return {
        workerId: worker.id,
        workerName: `${worker.firstName} ${worker.lastName}`,
        status: workerShift ? workerShift.shiftType : 'NOT_WORKING',
        location: workerShift?.location || null,
        shiftStart: workerShift?.startTime || null,
        shiftEnd: workerShift?.endTime || null
      };
    });

    res.json(workerStatus);
  } catch (error: any) {
    console.error('Error fetching current day status:', error);
    res.status(500).json({ 
      message: 'Error fetching current day status', 
      error: error?.message || 'Unknown error' 
    });
  }
});

// Create shift
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { workerId, shiftType, startTime, endTime, hoursWorked, location } = req.body;

    // Validate required fields
    if (!workerId || !shiftType || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // For non-leave shifts, hoursWorked is required
    if (!isLeaveType(shiftType as ShiftType) && !hoursWorked) {
      return res.status(400).json({ message: 'Hours worked is required for non-leave shifts' });
    }

    // Find the worker
    const worker = await workerRepository.findOne({
      where: { id: Number(workerId) }
    });

    if (!worker) {
      return res.status(400).json({ message: 'Worker not found' });
    }

    // Parse dates and adjust for timezone
    const shiftStartDate = new Date(startTime);
    const shiftEndDate = new Date(endTime);

    // Get the period dates for the shift's start date (in local time)
    const periodStart = new Date(shiftStartDate.getFullYear(), shiftStartDate.getMonth(), 30);
    periodStart.setHours(0, 0, 0, 0);
    if (periodStart > shiftStartDate) {
      periodStart.setMonth(periodStart.getMonth() - 1);
    }

    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    periodEnd.setDate(26);
    periodEnd.setHours(23, 59, 59, 999);

    console.log('Creating shift with dates:', {
      shiftStartDate: shiftStartDate.toISOString(),
      shiftEndDate: shiftEndDate.toISOString(),
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      shiftStartLocal: shiftStartDate.toString(),
      periodStartLocal: periodStart.toString()
    });

    // Get worker period hours for this period
    const periodHours = await periodHoursRepository
      .createQueryBuilder('wph')
      .where('wph.workerId = :workerId', { workerId })
      .andWhere('date(wph.periodStart) = date(:periodStart)', { periodStart: periodStart.toISOString() })
      .andWhere('date(wph.periodEnd) = date(:periodEnd)', { periodEnd: periodEnd.toISOString() })
      .getOne();

    if (!periodHours) {
      console.error('No period hours found:', {
        workerId,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString()
      });
      return res.status(400).json({
        message: 'Cannot create shift: Worker has no available hours for this period',
        workerId,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        shiftStartDate: startTime
      });
    }

    // Calculate total hours worked in this period
    const existingShifts = await shiftRepository
      .createQueryBuilder('shift')
      .where('shift.worker = :workerId', { workerId: worker.id })
      .andWhere('shift.startTime >= :periodStart', { periodStart: periodStart.toISOString() })
      .andWhere('shift.endTime <= :periodEnd', { periodEnd: periodEnd.toISOString() })
      .getMany();

    const totalHoursWorked = existingShifts.reduce((sum, shift) => sum + (shift.hoursWorked || 0), 0);
    const remainingHours = periodHours.maxHours - totalHoursWorked;

    // Only check remaining hours for non-leave shifts
    if (!isLeaveType(shiftType as ShiftType) && hoursWorked > remainingHours) {
      return res.status(400).json({
        message: `Cannot create shift: Exceeds available hours (${remainingHours.toFixed(1)} hours remaining)`,
        remainingHours,
        requestedHours: hoursWorked
      });
    }

    // Create the shift
    const shift = shiftRepository.create({
      worker,
      shiftType,
      startTime: shiftStartDate,
      endTime: shiftEndDate,
      hoursWorked: isLeaveType(shiftType as ShiftType) ? 0 : hoursWorked,
      location
    });

    const savedShift = await shiftRepository.save(shift);
    
    // Return the saved shift with worker details
    const shiftWithWorker = await shiftRepository.findOne({
      where: { id: savedShift.id },
      relations: ['worker']
    });

    return res.status(201).json(shiftWithWorker);

  } catch (error) {
    console.error('Error creating shift:', error);
    return res.status(500).json({ message: 'Error creating shift' });
  }
});

// Update shift
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { startTime, endTime, shiftType, location } = req.body;
    const shift = await shiftRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['worker']
    });
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    shift.startTime = new Date(startTime);
    shift.endTime = new Date(endTime);
    shift.shiftType = shiftType;
    shift.location = location || null;
    shift.hoursWorked = calculateHoursWorked(shift.startTime, shift.endTime);

    await shiftRepository.save(shift);
    res.json(shift);
  } catch (error: any) {
    console.error('Error updating shift:', error);
    res.status(400).json({ 
      message: 'Error updating shift',
      error: error?.message || 'Unknown error' 
    });
  }
});

// Delete shift
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const shift = await shiftRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    await shiftRepository.remove(shift);
    res.json({ message: 'Shift deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ 
      message: 'Error deleting shift',
      error: error?.message || 'Unknown error' 
    });
  }
});

export default router;
