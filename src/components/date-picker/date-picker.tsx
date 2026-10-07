'use client';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeftIcon,
  ChevronRight,
} from 'lucide-react';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverTrigger } from '@/components/ui/popover';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { addDays, format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { NavigationButton } from './navigation-button';

export const DatePicker = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const getInitialDate = useCallback(() => {
    if (!dateParam) return;

    const [year, month, day] = dateParam.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (!isValid(parsedDate)) return new Date();

    return parsedDate;
  }, [dateParam]);

  const [date, setDate] = useState<Date | undefined>(getInitialDate);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const updateURLWithDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('date', format(selectedDate, 'yyyy-MM-dd'));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleNavigateDay = (days: number) => {
    const newDate = addDays(date || new Date(), days);
    updateURLWithDate(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    updateURLWithDate(selectedDate);
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    const newDate = getInitialDate();

    if (date?.getTime() !== newDate?.getTime()) {
      // The URL parameter is an external source of truth for this state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(newDate);
    }
  }, [date, getInitialDate]);

  return (
    <div>
      <NavigationButton
        tooltipText="Dia anterior"
        onClick={() => handleNavigateDay(-1)}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </NavigationButton>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger className="min-w-[180px] justify-between text-left font-normal bg-transparent border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-content-brand" />
            {date ? (
              format(date, 'PPP', { locale: ptBR })
            ) : (
              <span>Selecione uma Data</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            autoFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <NavigationButton
        tooltipText="Dia seguinte"
        onClick={() => handleNavigateDay(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </NavigationButton>
    </div>
  );
};
