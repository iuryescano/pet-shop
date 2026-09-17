import { PeriodSection } from '@/components/period-section';
import { groupAppointmentsByPeriod, APPOINTMENT_DATA } from '@/utils';
import { AppointmentForm } from '@/components/appointment-form/appointment-form';
// import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Fetch appointments from the database
  //const appoint = await prisma.appointment.findMany({});

  const periods = groupAppointmentsByPeriod(APPOINTMENT_DATA);

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
      </div>

      <div className="pb-24 md:pb-0">
        {periods.map((period, index) => (
          <PeriodSection key={index} period={period} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 justify-center bg-[#23242C] py-[18px] px-6 md:bottom-6 md:right-6 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <AppointmentForm />
      </div>
    </div>
  );
}
