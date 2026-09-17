import { Appointment as AppointmentPrisma } from '@/generated/prisma';
import {
  Appointment,
  AppointmentPeriodDay,
  AppointmentPeriod,
} from '@/types/appointments';

export const getPeriod = (hour: number): AppointmentPeriodDay => {
  if (hour >= 9 && hour < 12) {
    return 'morning';
  }
  if (hour >= 13 && hour < 18) {
    return 'afternoon';
  }
  return 'evening';
};

export const groupAppointmentsByPeriod = (
  appointments: Array<Omit<Appointment, 'time' | 'period'>>
): AppointmentPeriod[] => {
  const transformedAppointments: Appointment[] = appointments?.map((apt) => ({
    ...apt,
    time: apt.scheduledAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    service: apt.description,
    period: getPeriod(apt.scheduledAt.getHours()),
  }));

  const morningAppintments = transformedAppointments?.filter(
    (apt) => apt.period === 'morning'
  );
  const afternoonAppintments = transformedAppointments?.filter(
    (apt) => apt.period === 'afternoon'
  );
  const eveningAppintments = transformedAppointments?.filter(
    (apt) => apt.period === 'evening'
  );

  return [
    {
      title: 'morning',
      type: 'morning',
      timeRange: '09:00 - 12:00',
      appointments: morningAppintments,
    },
    {
      title: 'afternoon',
      type: 'afternoon',
      timeRange: '13:00 - 19:00',
      appointments: afternoonAppintments,
    },
    {
      title: 'evening',
      type: 'evening',
      timeRange: '19:00 - 21:00',
      appointments: eveningAppintments,
    },
  ];
};
