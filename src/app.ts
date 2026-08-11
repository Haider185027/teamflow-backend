import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import organizationsRoutes from "./modules/organizations/organizations.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationsRoutes);

app.use(errorHandler);

export default app;
