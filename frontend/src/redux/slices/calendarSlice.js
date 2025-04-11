import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEvents as fetchEventsAPI,
  createEvent as createEventAPI,
  updateEvent as updateEventAPI,
  deleteEvent as deleteEventAPI,
  fetchGoals as fetchGoalsAPI,
} from "../../services/api";

const initialState = {
  events: [],
  goals: [],
  selectedGoal: null,
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  "calendar/fetchEvents",
  async () => {
    return await fetchEventsAPI();
  }
);

export const fetchGoals = createAsyncThunk("calendar/fetchGoals", async () => {
  return await fetchGoalsAPI();
});

export const createEvent = createAsyncThunk(
  "calendar/createEvent",
  async (event) => {
    // console.log("Thunk received event:", event);
    return await createEventAPI(event);
  }
);

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async (event) => {
    return await updateEventAPI(event);
  }
);

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (id) => {
    await deleteEventAPI(id);
    return id;
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        const parsedEvents = action.payload.map((event) => ({
          ...event,
          startTime:
            typeof event.startTime === "string"
              ? new Date(event.startTime)
              : event.startTime,
          endTime:
            typeof event.endTime === "string"
              ? new Date(event.endTime)
              : event.endTime,
          date:
            typeof event.date === "string" ? new Date(event.date) : event.date,
        }));

        state.events = parsedEvents;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.goals = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      });
  },
});

export const { setSelectedGoal } = calendarSlice.actions;

export default calendarSlice.reducer;
