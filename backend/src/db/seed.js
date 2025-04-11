import connectDB from "./index.js";
import { Goal } from "../models/Goal.model.js";
import { Task } from "../models/Task.model.js";

const goals = [
  { name: "Be fit", color: "#e74c3c" },
  { name: "Academics", color: "#3498db" },
  { name: "LEARN", color: "#f2c1e7" },
  { name: "Sports", color: "#2ecc71" },
];

const taskTemplates = {
  "Be fit": [
    { name: "Morning Run" },
    { name: "Gym Session" },
    { name: "Yoga" },
  ],
  "Academics": [{ name: "Study Math" }, { name: "Read Article" }],
  "LEARN": [
    { name: "AI based agents" },
    { name: "MLE" },
    { name: "DE related" },
    { name: "Basics" },
  ],
  "Sports": [{ name: "Basketball Practice" }, { name: "Swimming" }],
};

const seedDB = async () => {
  try {
    await connectDB();

    await Goal.deleteMany({});
    await Task.deleteMany({});

    const insertedGoals = await Goal.insertMany(goals);

    const tasksToInsert = [];

    insertedGoals.forEach((goal) => {
      const tasks = taskTemplates[goal.name];
      if (tasks && tasks.length) {
        tasks.forEach((task) => {
          tasksToInsert.push({
            name: task.name,
            goalId: goal._id,
          });
        });
      }
    });

    await Task.insertMany(tasksToInsert);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
