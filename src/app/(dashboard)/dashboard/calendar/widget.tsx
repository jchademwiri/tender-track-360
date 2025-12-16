'use client';

import React, { useCallback, useMemo, useState, useTransition } from 'react';
import FullCalendar from '@fullcalendar/react';
import type {
  DatesSetArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getCalendarEvents } from '@/server';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

type CalendarType =
  | 'tender_submission'
  | 'po_expected_delivery'
  | 'po_delivered';

export function CalendarClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [types, setTypes] = useState<CalendarType[]>([
    'tender_submission',
    'po_expected_delivery',
    'po_delivered',
  ]);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleRangeChange = useCallback(
    async (arg: DatesSetArg, setEvents: (events: EventInput[]) => void) => {
      const startIso = arg.startStr;
      const endIso = arg.endStr;
      startTransition(async () => {
        const events = await getCalendarEvents({
          start: startIso,
          end: endIso,
          types,
          status: status ? [status] : undefined,
        });
        const fullcalendarEvents = events.map((e) => ({
          id: e.id,
          title: e.title,
          start: e.date,
          allDay: true,
          classNames: [`event-${e.type}`, `color-${e.color}`],
        }));
        setEvents(fullcalendarEvents);
      });
    },
    [types, status]
  );

  const headerToolbar = useMemo(
    () => ({
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    }),
    []
  );

  const [fcEvents, setFcEvents] = useState<EventInput[]>([]);

  const onDatesSet = useCallback(
    (arg: DatesSetArg) => handleRangeChange(arg, setFcEvents),
    [handleRangeChange]
  );

  const onEventClick = useCallback(
    (info: EventClickArg) => {
      // Basic routing heuristic: tenders vs POs by CSS class
      if (info.event.classNames.includes('event-tender_submission')) {
        router.push(`/dashboard/tenders`);
      } else {
        router.push(`/dashboard/projects`);
      }
    },
    [router]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg border border-white/5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="chk-tender"
              checked={types.includes('tender_submission')}
              onCheckedChange={(c) => {
                const checked = Boolean(c);
                setTypes((prev) =>
                  checked
                    ? Array.from(new Set([...prev, 'tender_submission']))
                    : prev.filter((t) => t !== 'tender_submission')
                );
              }}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="chk-tender"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Tenders
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="chk-po-exp"
              checked={types.includes('po_expected_delivery')}
              onCheckedChange={(c) => {
                const checked = Boolean(c);
                setTypes((prev) =>
                  checked
                    ? Array.from(new Set([...prev, 'po_expected_delivery']))
                    : prev.filter((t) => t !== 'po_expected_delivery')
                );
              }}
              className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
            />
            <label
              htmlFor="chk-po-exp"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              PO Expected
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="chk-po-del"
              checked={types.includes('po_delivered')}
              onCheckedChange={(c) => {
                const checked = Boolean(c);
                setTypes((prev) =>
                  checked
                    ? Array.from(new Set([...prev, 'po_delivered']))
                    : prev.filter((t) => t !== 'po_delivered')
                );
              }}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <label
              htmlFor="chk-po-del"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              PO Delivered
            </label>
          </div>
        </div>

        <Select
          onValueChange={(v) => setStatus(v === 'all' ? undefined : v)}
          value={status ?? 'all'}
        >
          <SelectTrigger className="w-full md:w-[200px] bg-background/50">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending && <Skeleton className="h-8 w-full" />}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={headerToolbar}
        dayHeaderFormat={{ weekday: 'short' }}
        events={fcEvents}
        datesSet={onDatesSet}
        eventClick={onEventClick}
        height="auto"
        contentHeight="auto"
        expandRows
        stickyHeaderDates
      />
    </div>
  );
}
