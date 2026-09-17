'use client';

import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';

const appointmentFormSchema = z.object({
  tutorName: z.string().min(3, 'O nome do tutor é obrigatório'),
  petName: z.string().min(3, 'O nome do pet é obrigatório'),
  phone: z.string().min(11, 'O telefone é obrigatório'),
  description: z.string().min(3, 'A descrição do serviço é obrigatória'),
});

type AppointFormValues = z.infer<typeof appointmentFormSchema>;

export const AppointmentForm = () => {
  const form = useForm<AppointFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      phone: '',
      description: '',
    },
  });

  const onSubmit = (data: AppointFormValues) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Novo Agendamento</Button>
      </DialogTrigger>

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
            <div className="space-y-2">
              <label
                htmlFor="tutorName"
                className="text-sm font-medium text-foreground"
              >
                Nome do tutor
              </label>
              <input
                id="tutorName"
                type="text"
                placeholder="Nome do tutor"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
                {...form.register('tutorName')}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="petName"
                className="text-sm font-medium text-foreground"
              >
                Nome do pet
              </label>
              <input
                id="petName"
                type="text"
                placeholder="Nome do pet"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
                {...form.register('petName')}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
                {...form.register('phone')}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Descrição do serviço
              </label>
              <textarea
                id="description"
                placeholder="Descreva o atendimento"
                className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
                {...form.register('description')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
