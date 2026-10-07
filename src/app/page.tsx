import { PeriodSection } from '@/components/period-section';
import { groupAppointmentsByPeriod } from '@/utils';
import { AppointmentForm } from '@/components/appointment-form/appointment-form';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { DatePicker } from '@/components/date-picker';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date ? parseISO(date) : new Date(); //Basically if the date is not provided, it will use the current date

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: {
        gte: startOfDay(selectedDate), //start of the day of the selected date
        lte: endOfDay(selectedDate), //end of the day of the selected date
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });

  const periods = groupAppointmentsByPeriod(appointments);

  return (
    <div className="bg-blackground-primary p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-title-size text-content-primary mb-2">
            Sua Agenda
          </h1>
          <p className="text-paragraph-medium-size text-content-secondary">
            Aqui voce pode ver todos os clientes e servicos agendados para hoje
          </p>
        </div>

        <div className="hidden md:flex item-center gap-4">
          <DatePicker />
        </div>

        <div className="mt-3 mb-8 md:hidden">
          <DatePicker />
        </div>
      </div>

      <div className="pb-24 md:pb-0">
        {periods.map((period, index) => (
          <PeriodSection key={index} period={period} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 justify-center bg-[#23242C] py-[18px] px-6 md:bottom-6 md:right-6 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <AppointmentForm>
          <Button variant="brand">Novo Agendamento</Button>
        </AppointmentForm>
      </div>
    </div>
  );
}
