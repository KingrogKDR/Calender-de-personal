import express from "express";
import cors from "cors";
import { Goal } from "./models/Goal.model.js";
import { Task } from "./models/Task.model.js";
import { Event } from "./models/Event.model.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// routes

// goal routes //
app.get("/api/goals", async (req, res) => {
  try {
    const goals = await Goal.find().sort("name");
    res.status(200).json(goals);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: "Failed getting goals" });
  }
});

app.post("/api/goals", async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, status: "Failed creating goal" });
  }
});

app.put("/api/goals/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json(goal);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, status: "Failed updating goal" });
  }
});

app.delete("/api/goals/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    await Task.deleteMany({ goalId: req.params.id });
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: "Failed deleting goal" });
  }
});

// task routes //

app.get("/api/tasks", async (req, res) => {
  try {
    const { goalId } = req.query;
    const query = goalId ? { goalId } : {};
    const tasks = await Task.find(query).populate("goalId");
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: "Failed getting tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, status: "Failed creating task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, status: "Failed updating task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: "Failed deleting task" });
  }
});

// event routes //

app.get("/api/events", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query = {
        startTime: { $gte: new Date(startDate) },
        endTime: { $lte: new Date(endDate) },
      };
    }

    const events = await Event.find(query).populate("taskId");
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: "Failed getting events" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    // console.log("Event:", req.body)
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message, status: "Failed creating event" });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message, status: "Failed updating event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "Failed deleting event" });
  }
});

export { app };
