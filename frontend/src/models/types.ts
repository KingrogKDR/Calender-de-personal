export interface Event {
  _id?: string;
  title: string;
  category: "exercise" | "eating" | "work" | "relax" | "family" | "social";
  start: Date;
  end: Date;
  goalId?: string;
}

export interface Goal {
  _id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  _id: string;
  name: string;
  goalId: string;
}
