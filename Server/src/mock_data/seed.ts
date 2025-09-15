import path from "path";
import { db } from "../config/firebase";
const data = require(path.join(__dirname, "./seed_data.json"));

function clearCollection(collectionName: string) {
    return db.collection(collectionName).get().then(snapshot => {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit().then(() => console.log(`Cleared collection: ${collectionName}`));
    });
}

function getDateOffset(offsetDays: number) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d;
}

const getPositiveIndex = (offset: number, length: number) => ((offset % length) + length) % length;

async function seedFirestore() {
    try {
        const children: string[] = [];
        const staffs: string[] = [];
        const users: string[] = [];

        // Clear existing collections
        await clearCollection("children");
        await clearCollection("staffs");
        await clearCollection("users");
        await clearCollection("dailyLogEntries");
        await clearCollection("healthRecordEntries");

        console.log("Seeding Children...");
        for (const entry of data.children) {
            const docRef = db.collection("children").doc();
            await docRef.set(entry);
            children.push(docRef.id);
        }

        console.log("Seeding Staffs...");
        for (const entry of data.staffs) {
            const docRef = db.collection("staffs").doc();
            await docRef.set(entry);
            staffs.push(docRef.id);
        }

        console.log("Seeding Users...");
        for (const entry of data.users) {
            const docRef = db.collection("users").doc();
            await docRef.set(entry);
            users.push(docRef.id);
        }

        console.log("Seeding DailyLogEntries...");
        for (let dayOffset = -15; dayOffset <= 15; dayOffset++) {
            const timestamp = getDateOffset(dayOffset);
            for (const entry of data.dailyLogEntries) {
                const docRef = db.collection("dailyLogEntries").doc();
                await docRef.set({
                    ...entry,
                    childId: children[getPositiveIndex(dayOffset, children.length)],
                    staffId: staffs[getPositiveIndex(dayOffset, staffs.length)],
                    timestamp,
                });
            }
        }

        console.log("Seeding HealthRecordEntries...");
        for (let dayOffset = -15; dayOffset <= 15; dayOffset++) {
            const timestamp = getDateOffset(dayOffset);
            for (const entry of data.healthRecordEntries) {
                const docRef = db.collection("healthRecordEntries").doc();
                await docRef.set({
                    ...entry,
                    childId: children[getPositiveIndex(dayOffset, children.length)],
                    recordedByUserId: users[getPositiveIndex(dayOffset, users.length)],
                    timestamp,
                });
            }
        }

        console.log("Seeding Finished");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding Firestore:", error);
        process.exit(1);
    }
}

seedFirestore();
