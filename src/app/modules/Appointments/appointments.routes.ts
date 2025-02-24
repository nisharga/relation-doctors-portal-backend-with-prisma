import express from 'express';
import { appointmentController } from './appointments.controller';

const router = express.Router();
 
router.patch('/book-appointment', appointmentController.bookAppointment) 
router.patch('/start-appointment/:id', appointmentController.startAppointment)
router.patch('/finish-appointment/:id', appointmentController.finishAppointment)
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getSingleAppointment);
router.patch('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

export const appointmentRoutes = router;