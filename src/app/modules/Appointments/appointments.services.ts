import { Appointment } from "@prisma/client";
import prisma from "../../shared/prisma";

const bookAppointment = async(patientId: string, availableServiceId: string, appointmentDate: string): Promise<any> =>  {
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
 
const cancelAppointment = async( appointmentId: string ): Promise<any> => {
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId
            }
        })
        if(!appointment){
            throw new Error("Appointment doesn't exist")
        }
        if(appointment.status === 'cancelled'){
            throw new Error("Appointment is already cancelled")
        }
        if(appointment.status === 'finished'){
            throw new Error("Appointment is already finished")
        }

        const cancelAppointment = await prisma.$transaction(async transctionClient => {
        const appointmentCancel = await transctionClient.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                status: 'cancelled'
            }
        })

        const availableService = await transctionClient.availableService.findUnique({
            where: {
                id: appointment.availableServiceId
            }
        })

        await transctionClient.availableService.update({
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

        await transctionClient.payment.update({
            where: {
                appointmentId: appointmentId
            },
            data: {
                paymentStatus: "cancelled"
            }
        }) 

        return {
            appointment: appointmentCancel
        }

        })

    return cancelAppointment

}

 

const startAppointment = async (appointmentId: string): Promise<any> => {

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

    const startedAppointment = await prisma.$transaction(async transactionClient => {
        await transactionClient.payment.update({
            where: {
                appointmentId
            },
            data: {
                paymentStatus: 'paid',
                paymentDate: new Date().toISOString()
            }
        })

        const appointmentToStart = await transactionClient.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                status: "started"
            }
        })

        if (!appointmentToStart) {
            await transactionClient.payment.update({
                where: {
                    appointmentId
                },
                data: {
                    paymentStatus: "refund"
                }
            })
        }

        return appointmentToStart
    })

    return startedAppointment
}

const finishAppointment = async (appointmentId: string): Promise<any> => {
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

    const appointmentToFinish = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: "finished"
        }
    })

    return appointmentToFinish
}

const getAllAppointments = async (): Promise<Appointment[] | any> => {
    const result = await prisma.appointment.findMany();
    const total = await prisma.appointment.count();
    return {
        meta: {
            total
        },
        data: result
    };
};

const getSingleAppointment = async (id: string): Promise<Appointment | null> => {
    const result = await prisma.appointment.findUnique({
        where: {
            id: id
        }
    });
    return result;
};

const updateAppointment = async (id: string, appointment: Appointment): Promise<Appointment> => {
    const result = await prisma.appointment.update({
        where: {
            id: id
        },
        data: appointment
    });
    return result;
};

const deleteAppointment = async (id: string): Promise<Appointment> => {
    const result = await prisma.appointment.delete({
        where: {
            id: id
        }
    });
    return result;
};

export const appointmentServices = {
    bookAppointment, 
    cancelAppointment,
    startAppointment,
    finishAppointment,
    getAllAppointments,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment
}