import {db} from "../../config/firebase";

export const getStaffs = async () => {
    const staffRef = db.collection("staffs");
    const snapshot = await staffRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getChildren = async () => {
    const childrenRef = db.collection("children");
    const snapshot = await childrenRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getUser = async () => {
    const userRef = db.collection("users");
    const snapshot = await userRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

interface DailyLog {
    id: string,
    childId: string,
    staffId: string
}

interface HealthRecord {
    id: string,
    childId: string,
    recordedByUserId: string
}

export const getDailyReport = async (
    startDate: Date,
    endDate: Date,
    filters: { child_id?: string[]; staff_id?: string[]; user_id?: string[] }
): Promise<any> => {
    let dailyLogEntriesRef: FirebaseFirestore.Query = db
        .collection("dailyLogEntries")
        .where("timestamp", ">=", startDate)
        .where("timestamp", "<=", endDate);

    let healthRecordEntriesRef: FirebaseFirestore.Query = db
        .collection("healthRecordEntries")
        .where("timestamp", ">=", startDate)
        .where("timestamp", "<=", endDate);

    // Multiple child filtering
    if (filters.child_id && filters.child_id.length > 0) {
        dailyLogEntriesRef = dailyLogEntriesRef.where("childId", "in", filters.child_id);
        healthRecordEntriesRef = healthRecordEntriesRef.where("childId", "in", filters.child_id);
    }

    // Multiple staff filtering
    if (filters.staff_id && filters.staff_id.length > 0) {
        dailyLogEntriesRef = dailyLogEntriesRef.where("staffId", "in", filters.staff_id);
    }

    // Multiple user filtering
    if (filters.user_id && filters.user_id.length > 0) {
        healthRecordEntriesRef = healthRecordEntriesRef.where("recordedByUserId", "in", filters.user_id);
    }

    const [snapshotLog, snapshotHealth] = await Promise.all([
        dailyLogEntriesRef.get(),
        healthRecordEntriesRef.get(),
    ]);

    const dailyLogEntries: DailyLog[] = snapshotLog.docs.map(
        doc => ({ id: doc.id, ...(doc.data() as Omit<DailyLog, "id">) })
    );

    const healthRecordEntries: HealthRecord[] = snapshotHealth.docs.map(
        doc => ({ id: doc.id, ...(doc.data() as Omit<HealthRecord, "id">) })
    );

    const childIds = new Set<string>();
    const staffIds = new Set<string>();
    const userIds = new Set<string>();

    dailyLogEntries.forEach((e: DailyLog) => {
        if (e.childId) childIds.add(e.childId);
        if (e.staffId) staffIds.add(e.staffId);
    });
    healthRecordEntries.forEach((e: HealthRecord) => {
        if (e.childId) childIds.add(e.childId);
        if (e.recordedByUserId) userIds.add(e.recordedByUserId);
    });

    const childMap = await enrichChildren(childIds);
    const staffMap = await enrichStaff(staffIds);
    const userMap = await enrichUser(userIds);

    const enrichedDailyLogs = dailyLogEntries.map((entry: DailyLog) => ({
        ...entry,
        child: entry.childId ? childMap[entry.childId] || null : null,
        staff: entry.staffId ? staffMap[entry.staffId] || null : null,
    }));

    const enrichedHealthRecords = healthRecordEntries.map((entry: HealthRecord) => ({
        ...entry,
        child: entry.childId ? childMap[entry.childId] || null : null,
        recordedByUser: entry.recordedByUserId ? userMap[entry.recordedByUserId] || null : null,
    }));

    return {
        dailyLogEntries: enrichedDailyLogs,
        healthRecordEntries: enrichedHealthRecords,
    };
};

async function enrichChildren (childIds: Set<string>) {
    if (childIds.size === 0) return {};
    const childrenSnap = await  db.collection("children").where("__name__", "in", Array.from(childIds)).get()
    const childMap: Record<string, any> = {};
    if ("docs" in childrenSnap)
        childrenSnap.docs.forEach(doc => (childMap[doc.id] = doc.data()));
    return childMap
}

const enrichStaff = async (staffIds: Set<string>) => {
    if (staffIds.size === 0) return {};
    const staffSnap = await  db.collection("staffs")
        .where("__name__", "in", Array.from(staffIds)).get()
    const staffMap: Record<string, any> = {};
    if ("docs" in staffSnap)
        staffSnap.docs.forEach(doc => (staffMap[doc.id] = doc.data()));
    return staffMap
}

const enrichUser = async (userIds: Set<string>) => {
    if (userIds.size === 0) return {};
    const userSnap = await  db.collection("users")
        .where("__name__", "in", Array.from(userIds)).get()
    const userMap: Record<string, any> = {};
    if ("docs" in userSnap)
        userSnap.docs.forEach(doc => (userMap[doc.id] = doc.data()));
    return userMap
}

export interface DailyLogReport {
    meal: number,
    nap: number,
    mood: number,
    diaper: number
}

export const generateDailyLogReport = (data: {type: string}[]): DailyLogReport => {
    let meal = 0
    let nap = 0
    let mood = 0
    let diaper = 0
    for (const entry of data){
        if (entry.type === "Meal") meal+=1
        if (entry.type === "Nap") nap+=1
        if (entry.type === "Mood") mood+=1
        if (entry.type === "Diaper") diaper+=1
    }
    return {
        meal, nap, mood, diaper,
    }
}

export const calculateDifference = (
    previousSummary: DailyLogReport,
    previousReport: any,
    currentMetrics: DailyLogReport & { incident: number }
) => {
    const previousMetrics: typeof currentMetrics = {
        ...previousSummary,
        incident: previousReport.healthRecordEntries.length,
    };

    const percentageDiff: Record<keyof typeof currentMetrics, number> = {} as any;

    (Object.keys(currentMetrics) as Array<keyof typeof currentMetrics>).forEach(key => {
        const currentValue = currentMetrics[key] || 0;
        const prevValue = previousMetrics[key] || 0;
        percentageDiff[key] = prevValue === 0 ? 100 : ((currentValue - prevValue) / prevValue) * 100;
    });

    return { previousMetrics, percentageDiff };
};