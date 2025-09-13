import { Router } from "express";
import { db } from "../../config/firebase";
import { validateStaff} from "./staffSchema";

const router = Router();

router.post("/", async (req, res) => {
    const validated = validateStaff(req.body);
    if (validated.error) {res.status(400).json(validated.error)}
    else {
        try {
            const userRef = db.collection("staff").doc();
            await userRef.set(validated);
            res.status(201).json(validated);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
});

router.get("/", async (req, res) => {
    try {
        const staffRef = db.collection("staff");
        const snapshot = await staffRef.get();

        const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(staff);
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ error: "Failed to get staff" });
    }
});

export default router;
