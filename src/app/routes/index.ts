/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express'

import { specializationRoutes } from '../modules/Specializations/specializations.routes'
 
import { doctorRoutes } from '../modules/Doctors/Doctors.routes'


const router = express.Router()

const moduleRoutes: any[] = [
  {
    path: '/doctors',
    route: doctorRoutes,
  },
  {
    path: '/specializations',
    route: specializationRoutes,
  } 
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
