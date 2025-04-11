const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";

export const fetchGoals = async () => {
  const response = await axios.get(`${API_URL}/goals`);
  if (response.status !== 200) {
    throw new Error(`Error fetching goals: ${response.statusText}`);
  }
  return response.data;
};

export const fetchTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  if (response.status !== 200) {
    throw new Error(`Error fetching tasks: ${response.statusText}`);
  }
  return response.data;
};

export const fetchEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const createEvent = async (event) => {
  try {
    // console.log("Event data being sent in api:", event);
    const response = await axios.post(`${API_URL}/events`, event, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error in createEvent:",
      error?.response?.data || error.message
    );
    throw error; 
  }
};

export const updateEvent = async (event) => {
  const response = await axios.put(`${API_URL}/events/${event._id}`, event);
  return response.data;
};

export const deleteEvent = async (id) => {
  await axios.delete(`${API_URL}/events/${id}`);
};
