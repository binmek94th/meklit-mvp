import path from "path";
import {db} from "../config/firebase";

const data = require(path.join(__dirname, "./seed_data.json"));

function random(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low);
}

async function seedFirestore() {
    try {
        const children = []
        const staffs = []
        const users = []
        console.log("Seeding Children...")
        for (const entry of data.children) {
            const docRef = db.collection("children").doc()
            await docRef.set(entry);
            children.push(docRef.id);
        }

        console.log("Seeding Staffs...")
        for (const entry of data.staffs) {
            const docRef = db.collection("staffs").doc()
            await docRef.set(entry);
            staffs.push(docRef.id);
        }

        console.log("Seeding Users...")
        for (const entry of data.users) {
            const docRef = db.collection("users").doc()
            await docRef.set(entry);
            users.push(docRef.id);
        }

        console.log("Seeding DailyLogEntries...");
        for (const entry of data.dailyLogEntries) {
            const docRef = db.collection("dailyLogEntries").doc();
            await docRef.set(
                { ...entry,
                    childId: children[random(0, children.length)],
                    staffId: staffs[random(0, staffs.length)],
                    timestamp: new Date(entry.timestamp) });
                }

        console.log("Seeding HealthRecordEntries...");

        for (const entry of data.healthRecordEntries) {
            const docRef = db.collection("healthRecordEntries").doc();
            await docRef.set(
                { ...entry,
                    timestamp: new Date(entry.timestamp),
                    childId: children[random(0, children.length)],
                    recordedByUserId: users[random(0, users.length)],
                });
        }

        console.log("Seeding Finished");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding Firestore:", error);
        process.exit(1);
    }
}

seedFirestore();
