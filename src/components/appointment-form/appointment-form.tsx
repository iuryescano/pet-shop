'use client';

import { useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format, setHours, setMinutes, startOfToday } from 'date-fns';
import { Appointment } from '@/types/appointments';
import { useEffect } from 'react';

import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  Dog,
  Loader2,
  Phone,
  User,
} from 'lucide-react';

import { createAppointment } from '@/app/actions';
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { updateAppointment } from '@/app/actions';

const appointmentFormSchema = z
  .object({
    tutorName: z.string().min(3, 'O nome do tutor é obrigatório'),
    petName: z.string().min(3, 'O nome do pet é obrigatório'),
    phone: z.string().min(11, 'O telefone é obrigatório'),
    description: z.string().min(3, 'A descrição do serviço é obrigatória'),
    scheduleAt: z
      .date({
        error: 'A data do agendamento é obrigatória',
      })
      .min(startOfToday(), {
        message: 'A data do agendamento deve ser no futuro',
      }),
    time: z.string().min(1, 'O horário do agendamento é obrigatório'),
  })
  .superRefine((data, context) => {
    const [hours, minutes] = data.time.split(':').map(Number);
    const isValidTime =
      Number.isInteger(hours) &&
      Number.isInteger(minutes) &&
      minutes >= 0 &&
      minutes <= 59 &&
      ((hours >= 9 && hours < 12) ||
        (hours >= 13 && hours < 18) ||
        (hours >= 19 && hours < 21));

    if (!isValidTime) {
      context.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'O horário do agendamento deve estar entre 09:00 e 21:00',
      });
      return;
    }

    const scheduleDateTime = setMinutes(
      setHours(data.scheduleAt, hours),
      minutes
    );

    if (scheduleDateTime <= new Date()) {
      context.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'O horário do agendamento deve estar no futuro',
      });
    }
  });

type AppointFormValues = z.infer<typeof appointmentFormSchema>;

type AppointmentFormProps = {
  appointment?: Appointment;
  children?: React.ReactNode;
};

export const AppointmentForm = ({
  appointment,
  children,
}: AppointmentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<AppointFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      phone: '',
      description: '',
      scheduleAt: undefined,
      time: '',
    },
  });

  const onSubmit = async (data: AppointFormValues) => {
    const [hours, minutes] = data.time.split(':');

    const scheduledAt = new Date(data.scheduleAt);
    scheduledAt.setHours(Number(hours), Number(minutes), 0, 0);

    const isEdit = !!appointment?.id;

    const result = isEdit
      ? await updateAppointment(appointment.id, {
          ...data,
          scheduledAt,
        })
      : await createAppointment({
          ...data,
          scheduledAt,
        });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      `Agendamento ${isEdit ? 'atualizado' : 'criado'} com sucesso para ${format(scheduledAt, 'dd/MM/yyyy HH:mm')}`
    );

    setIsOpen(false);
    form.reset();
  };

  useEffect(() => {
    form.reset(appointment);
  }, [appointment, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        variant="appointment"
        overlayVariant="blurred"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle size="modal">Agende um atendimento</DialogTitle>
          <DialogDescription size="modal">
            Preencha os campos abaixo para agendar um atendimento com o cliente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="tutorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Nome do tutor
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-content-brand"
                        size={18}
                      />
                      <Input
                        {...field}
                        placeholder="Digite o nome do tutor"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Telefone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-content-brand"
                        size={18}
                      />
                      <Input
                        {...field}
                        type="tel"
                        placeholder="(00) 00000-0000"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Nome do pet
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Dog
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-content-brand"
                        size={18}
                      />
                      <Input
                        {...field}
                        placeholder="Digite o nome do pet"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <FormField
                control={form.control}
                name="scheduleAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Data do agendamento
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-between text-left font-normal bg-background-tertiary border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand'
                              )}
                            />
                          }
                        >
                          <div className="flex items-center gap-2">
                            <CalendarIcon
                              className="text-content-brand"
                              size={20}
                            />
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span className="text-content-primary">
                                Selecione uma data
                              </span>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startOfToday()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Hora
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-content-brand" />
                            <SelectValue placeholder="--:-- --" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 25 }, (_, index) => {
                            const hours = 9 + Math.floor(index / 2);
                            const minutes = index % 2 === 0 ? '00' : '30';
                            const value = `${String(hours).padStart(2, '0')}:${minutes}`;

                            const isAvailableTime =
                              (hours >= 9 && hours < 12) ||
                              (hours >= 13 && hours < 18) ||
                              (hours >= 19 && hours < 21);

                            if (!isAvailableTime) {
                              return null;
                            }

                            return (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Descrição do serviço
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva o serviço que será realizado"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="brand"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Agendar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
