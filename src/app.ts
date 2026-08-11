import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import organizationsRoutes from "./modules/organizations/organizations.routes";
import teamsRoutes from "./modules/teams/teams.routes";
import projectsRoutes from "./modules/projects/projects.routes";
import tasksRoutes from "./modules/tasks/tasks.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationsRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);

app.use(errorHandler);

export default app;
