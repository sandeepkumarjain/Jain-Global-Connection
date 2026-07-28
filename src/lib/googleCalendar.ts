export interface CalendarEventPayload {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD or ISO string
  endDate?: string;   // YYYY-MM-DD or ISO string
  location?: string;
}

export const createGoogleCalendarEvent = async (
  accessToken: string,
  payload: CalendarEventPayload
): Promise<any> => {
  // Format dates for Google Calendar API
  // If YYYY-MM-DD, set start.date and end.date
  let eventBody: any = {
    summary: payload.title,
    description: payload.description,
    location: payload.location || 'Jain Connect Global Community',
  };

  if (payload.startDate.includes('T')) {
    eventBody.start = { dateTime: payload.startDate };
    eventBody.end = { dateTime: payload.endDate || payload.startDate };
  } else {
    // All-day event
    const startStr = payload.startDate;
    // Calculate next day for end date
    const dateObj = new Date(startStr);
    dateObj.setDate(dateObj.getDate() + 1);
    const endStr = payload.endDate || dateObj.toISOString().split('T')[0];

    eventBody.start = { date: startStr };
    eventBody.end = { date: endStr };
  }

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to save event to Google Calendar');
  }

  return response.json();
};

export const getGoogleCalendarWebUrl = (payload: CalendarEventPayload): string => {
  const titleEnc = encodeURIComponent(payload.title);
  const detailsEnc = encodeURIComponent(payload.description);
  const locationEnc = encodeURIComponent(payload.location || 'Jain Sangh');

  let dateParam = '';
  if (payload.startDate.includes('-')) {
    const cleanStart = payload.startDate.replace(/-/g, '');
    const dateObj = new Date(payload.startDate);
    dateObj.setDate(dateObj.getDate() + 1);
    const cleanEnd = dateObj.toISOString().split('T')[0].replace(/-/g, '');
    dateParam = `${cleanStart}/${cleanEnd}`;
  } else {
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    dateParam = `${todayStr}/${todayStr}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&details=${detailsEnc}&location=${locationEnc}&dates=${dateParam}`;
};
