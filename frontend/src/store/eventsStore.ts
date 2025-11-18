import { create } from 'zustand';
import { eventsService } from '../services/events.service';
import type { MachineEvent, EventQueryParams, EventStatistics } from '../types';

interface EventsState {
  events: MachineEvent[];
  statistics: EventStatistics | null;
  isLoading: boolean;
  error: string | null;
  filters: EventQueryParams;
  fetchEvents: (params?: EventQueryParams) => Promise<void>;
  fetchStatistics: (start?: string, end?: string) => Promise<void>;
  setFilters: (filters: EventQueryParams) => void;
  clearEvents: () => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  statistics: null,
  isLoading: false,
  error: null,
  filters: {
    limit: 50,
    offset: 0,
  },

  fetchEvents: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const filters = params || get().filters;
      const events = await eventsService.getEvents(filters);
      set({ events, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch events';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStatistics: async (start, end) => {
    try {
      const statistics = await eventsService.getStatistics(start, end);
      set({ statistics });
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error);
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearEvents: () => {
    set({ events: [], statistics: null, error: null });
  },
}));
