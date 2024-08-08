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
