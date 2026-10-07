'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { calculatePeriod } from '@/utils/appointment-utils';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduledAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduledAt } = parsedData;
    const hour = scheduledAt.getHours();

    const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'O horário selecionado não está disponível. Por favor, escolha um horário entre 9h e 12h, 13h e 18h ou 19h e 21h.',
      };
    }

    const existingAppointmentsResponse = await prisma.appointment.findFirst({
      where: {
        scheduledAt,
      },
    });

    if (existingAppointmentsResponse) {
      return {
        error:
          'Já existe uma consulta agendada para este horário. Por favor, escolha outro horário.',
      };
    }

    await prisma.appointment.create({
      data: parsedData,
    });

    revalidatePath('/'); // Revalidate the home page to reflect the new appointment
    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      error: 'Não foi possível criar o agendamento. Tente novamente.',
    };
  }
}

export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduledAt } = parsedData;
    const hour = scheduledAt.getHours();

    const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'O horário selecionado não está disponível. Por favor, escolha um horário entre 9h e 12h, 13h e 18h ou 19h e 21h.',
      };
    }

    const existingAppointmentsResponse = await prisma.appointment.findFirst({
      where: {
        scheduledAt,
        NOT: {
          id: id,
        },
      },
    });

    if (existingAppointmentsResponse) {
      return {
        error:
          'Já existe uma consulta agendada para este horário. Por favor, escolha outro horário.',
      };
    }

    await prisma.appointment.update({
      where: { id },
      data: parsedData,
    });

    revalidatePath('/'); // Revalidate the home page to reflect the updated appointment
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: 'Dados inválidos para atualização do agendamento.',
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id },
    });

    revalidatePath('/'); // Revalidate the home page to reflect the deleted appointment
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: 'Não foi possível excluir o agendamento. Tente novamente.',
    };
  }
}
