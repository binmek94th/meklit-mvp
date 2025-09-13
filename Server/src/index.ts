import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import childrenRouter from "./routes/children/children";
import staffRouter from "./routes/staff/staff";
import reportRouter from "./routes/report/report";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/children', childrenRouter)
app.use('/api/staff', staffRouter)
app.use('/api/report', reportRouter)

app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
