import { api } from './api';
import type { APIResponse, MachineEvent, EventQueryParams, EventStatistics } from '../types';

export const eventsService = {
  async getEvents(params?: EventQueryParams): Promise<MachineEvent[]> {
    const response = await api.get<APIResponse<MachineEvent[]>>('/events', { params });
    return response.data.data || [];
  },

  async getEventById(id: string): Promise<MachineEvent> {
    const response = await api.get<APIResponse<MachineEvent>>(`/events/${id}`);
    return response.data.data!;
  },

  async getStatistics(start?: string, end?: string): Promise<EventStatistics> {
    const response = await api.get<APIResponse<EventStatistics>>('/events/statistics', {
      params: { start, end },
    });
    return response.data.data!;
  },
};
