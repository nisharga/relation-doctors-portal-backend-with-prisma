/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express'

import { specializationRoutes } from '../modules/Specializations/specializations.routes'
 
import { doctorRoutes } from '../modules/Doctors/Doctors.routes'
import { patientRoutes } from '../modules/Patients/patients.routes'
import { appointmentRoutes } from '../modules/Appointments/appointments.routes'
import { availableServiceRoutes } from '../modules/AvailableServices/availableServices.routes'
import { medicalProfileRoutes } from '../modules/MedicalProfiles/medicalProfiles.routes'
import { availableDoctorRoutes } from '../modules/AvailableDoctors/availableDoctors.routes'
import { serviceRoutes } from '../modules/Services/services.routes'
import { timeSlotsRoutes } from '../modules/TimeSlots/timeSlots.routes'
import { paymentRoutes } from '../modules/Payments/payments.routes'
import { adminRoutes } from '../modules/Admins/admins.routes'
import { authRoutes } from '../modules/Auth/auth.route'


const router = express.Router()

const moduleRoutes: any[] = [
  {
    path: '/doctors',
    route: doctorRoutes,
  },
  {
    path: '/specializations',
    route: specializationRoutes,
  } ,
  {
    path: '/patients',
    route: patientRoutes,
  },
  {
    path: '/appointments',
    route: appointmentRoutes, 
  },
  {
    path: '/medical-profiles',
    route: medicalProfileRoutes,
  },
  {
    path: '/available-doctors',
    route: availableDoctorRoutes,
  },
  {
    path: '/available-services',
    route: availableServiceRoutes,
  },
  {
    path: '/services',
    route: serviceRoutes,
  },
  {
    path: '/time-slots',
    route: timeSlotsRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
