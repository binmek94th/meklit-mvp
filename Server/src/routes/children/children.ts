import { Router } from "express";
import { db } from "../../config/firebase";
import {validateChildren} from "./childrenSchema";

const router = Router();

router.post("/", async (req, res) => {
    const validated = validateChildren(req.body);
    if (validated.error) {res.status(400).json(validated.error)}
    else {
        try {
            const userRef = db.collection("children").doc();
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
        const childrenRef = db.collection("children");
        const snapshot = await childrenRef.get();

        const children = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(children);
    } catch (error) {
        console.error("Error fetching children:", error);
        res.status(500).json({ error: "Failed to get children" });
    }
});

export default router;
