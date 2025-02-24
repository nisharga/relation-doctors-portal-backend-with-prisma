### 0.Prerequisites:

Download the stater pack from here 🙂 install and work on existing project 🙂
Add supabase DB URL.. finally

Package.json script

```
"scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "lint:check": "eslint --ignore-path .eslintignore --ext .js,.ts .",
    "lint:fix": "eslint . --fix",
    "prettier:check": "prettier --ignore-path .gitignore --write \"**/*.+(js|ts|json)\"",
    "prettier:fix": "prettier --write .",
    "lint-prettier": "yarn lint:check && yarn prettier:check",
    "test": "echo \"Error: no test specified\" && exit 1",
    "postinstall": "prisma generate"
  },
```

Post-install must need for deploy because after deploy if prisma generate not work then nothing will work for you..

You will get already two tables of data and two modules for it which you can use.

Remove Everything From route.ts...

Then Install Prisma Client: `npm i @prisma/client`

## Understand Logic

Eki Time e user Jodi Open_Heart_Surgery er appointment er nei seta accept Korbe….
Abr doctor Jodi rugi dekhar appointment nei setae accept Korbe…

```
model AvailableDoctors {
id String @id @default(uuid())
availableDate String @map("available_date")

createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

availableServices AvailableServices[]

slotId String @map("slot_id")
timeSlots TimeSlots @relation(fields: [slotId], references: [id])

@@map("available_doctors")
}
```

Now we wants same Date e… same slot e… same service 2 bar neya jabe nah…
Thats why prisma te ekta coolest ekta jinish ase seta holo….. @@unique ☑️

```
@@unique([slotId, availableServices, availableDate])
```

#### Funda 2: Real Life e 3 stage e kaj kora hoy:

    1.Development
    2.Stageing
    3.Production

Code er moto databse handle er jonno alada 3 ta server maintanance kora hoy.

Development e puta database remove kora very common bisoy 🙂

Ekhon model e ekta field add korte hobe but database e already 20 ta data ase. Emn time e best practice holo…

Field ta create kora seta optional kore deya 😀
Or default ekta value deya.

R ekta kaj kora jete pare… seperate ekta model create kore seta optional kora deya….
And frontend er form validation e bole deya j vai.. Eta requied eta sara tumi form submit korte parba nah 😛

Readandency thakte hobe code er..

### Transition and RoolBack

```
model Patient {
  id             String          @id @default(uuid())
  fullName       String          @map("full_name")
  email          String          @unique
  phoneNumber    String          @unique @map("phone_number")
  password       String          @unique
  role           String
  createdAt      DateTime        @default(now()) @map("created_at")
  updatedAt      DateTime        @updatedAt @map("updated_at")
  medicalProfile MedicalProfile?
  appointments   Appointment[]


  @@map("patients")
}
```

```
model MedicalProfile {
  id               String   @id @default(uuid())
  profilePricture  String?  @map("profile_pricture")
  address          String
  dob              String   @map("date_of_birth")
  gender           String
  medicalHistory   String?  @map("medical_history")
  emergencyContact String   @map("emergency_contact")
  profileStatus    String   @map("profile_status")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")


  patientId String  @unique @map("patient_id")
  patient   Patient @relation(fields: [patientId], references: [id])


  @@map("medical_history")
}
```

At first create patient ID.

```
const result =  await prisma.$transaction(
    async transctionClient => {

    }
  )
  return result
```

We we want two things at a time.. That time we use this transaction…
Our fanda is simple. Create patient first then using patient id create a medical profile finally return it.

Inside transcationClient peast this code

```
const createPatient = await transctionClient.patient.create({
            data: patient
        })


        const createMedicalProfile = await transctionClient.medicalProfile.create({
            data: {
                ...medicalProfile,
                patientId: createPatient.id,
                profileStatus: 'active'
            }
        })


        return {
            patient: createPatient,
            medicalProfile: createMedicalProfile
        }

```

In controller pass both data

```
const { medicalProfile, ...patientData } = req.body
    const patient = await patientServices.createPatient(
      patientData,
      medicalProfile,
    )
    res.status(200).json({
      status: 'success',
      message: 'Patient created successfully',
      data: patient,
    })
```

Finally connect it on route. And test

### Book a service

```
model Appointment {
  id              String   @id @default(uuid())
  appointmentDate DateTime @map("appointment_date")
  status          String   @map("appointment_status")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")


  patientId String  @map("patient_id")
  patient   Patient @relation(fields: [patientId], references: [id])


  payment Payment?


  availableServiceId String           @map("available_service_id")
  availableService   AvailableService @relation(fields: [availableServiceId], references: [id])


  @@map("appointments")
}
```

When we create Appointment at a same time we have to create payment as well so that its works well 🙂

##### Steps:

    #### 1.Appointment Create (if already create then error show)
    #### 2.Seats 1 minus and status true | false
    #### 3.Payment table create at a same time

Thats why we use transition for create 3 things at a same time.

```
const bookAppointment = async(patientId: string, availableServiceId: string, appointmentDate: string): Promise<any> => {
// first check available -1 or not. -1 means its not exist.
const availableService = await prisma.availableService.findUnique({
where: {
id: availableServiceId
}
})
if(!availableService){
throw new Error(`This service is not available`);
}
if(availableService.availableSeats === 0){
throw new Error(`This service is fully booked`);
}

    const booking = await prisma.$transaction(async transactionClient =>  {
        const appointment = await transactionClient.appointment.create({
            data: {
                appointmentDate,
                availableServiceId,
                patientId,
                status: 'pending'
            }
        })


        await transactionClient.availableService.update({
            where: {
                id: availableServiceId
            },
            data: {
                availableSeats: availableService.availableSeats - 1,
                isBooked: availableService.availableSeats - 1 === 0 ? true : false
            }
        })


        const payment = await transactionClient.payment.create({
            data: {
                amount: availableService.fees,
                paymentStatus: 'pending',
                appointmentId: appointment.id
            }
        })


       return {
        appointment: appointment,
        payment: payment
       }


    })
    return booking;

}
```

Our service is completed 🙂 Its time to create controller.

patientId, availableServiceId, appointmentDate

We need these 3 items from controller 🙂

controller.ts

```
export const bookAppointment = async (req: Request, res: Response, next: NextFunction) => {
try {
const { patientId , availableServiceId , appointmentDate } = req.body;
const appointment = await appointmentServices.bookAppointment(patientId , availableServiceId , appointmentDate);
res.status(200).json({
status: 'success',
message: 'Appointment started successfully',
data: appointment
});
} catch (error) {
next(error)
}
}
```

Simply take 3 things from req.body.
Then in service peast this :D

Steps 👍

1. AppointmentId diye check appointment ase kina
2. Appointment er status ta update hobe.
3. Appointment theke availableService er serviceID ta neya
4. Available seats and status update
5. Payment table er status cancel kore diba

cancel-appointment.tsx

```
const cancelAppointment = async (appointmentId: string): Promise<any> => {
const appointment = await prisma.appointment.findUnique({
where: {
id: appointmentId
}
})

    if (!appointment) {
        throw new Error("Appointment does not exist")
    }


    if (appointment.status === "cancelled") {
        throw new Error("Appointment has already been cancelled")
    }


    if (appointment.status === "finished") {
        throw new Error("Appointment has already been completed")
    }


    const cancelledAppointment = await prisma.$transaction(async transactionClient => {
        const appointmentToCancel = await transactionClient.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                status: "cancelled"
            }
        })


        const availableService = await transactionClient.availableService.findUnique({
            where: {
                id: appointment.availableServiceId
            }
        })


        await transactionClient.availableService.update({
            where: {
                id: appointment.availableServiceId
            },
            data: {
                availableSeats: {
                    increment: 1
                },


                isBooked: availableService && availableService.availableSeats + 1 > 0 ? false : true
            }
        })


        await transactionClient.payment.update({
            where: {
                appointmentId
            },
            data: {
                paymentStatus: "cancelled"
            }
        })


        return {
            appointment: appointmentToCancel
        }
    })
    return cancelledAppointment

}
```

cancelAppiontment.tsx

```
const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
try {
const { id } = req.params;
const appointment = await appointmentServices.cancelAppointment(id);
res.status(200).json({
status: 'success',
message: 'Appointment created successfully',
data: appointment
});
} catch (error) {
next(error)
}
};
```

Just id ta nao params theke and pathai dao…
