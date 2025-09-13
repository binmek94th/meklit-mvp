import {Router} from "express";
import {
    calculateDifference,
    generateDailyLogReport,
    getChildren,
    getDailyReport,
    getStaffs,
    getUser
} from "./utils";

const router = Router();

router.get("/general", async (req, res) => {
    try{
        const staffs = await getStaffs()
        const children = await getChildren()
        const users = await getUser()

        res.status(200).json({
            staffCount: staffs.length,
            childrenCount: children.length,
            usersCount: users.length,
        })
    }
    catch(err: any){
        res.status(500).json(err.message)
    }
})

router.get("/daily", async (req, res) => {
    const child_id = req.query.child_id as string | undefined;
    const staff_id = req.query.staff_id as string | undefined;

    try {
        const startDate = req.query.start_date
            ? new Date(req.query.start_date as string)
            : new Date(new Date().setHours(0, 0, 0, 0));

        const endDate = req.query.end_date
            ? new Date(req.query.end_date as string)
            : new Date(new Date().setHours(23, 59, 59, 999));

        const diffMs = endDate.getTime() - startDate.getTime();

        const prevEndDate = new Date(startDate.getTime() - 1);
        const prevStartDate = new Date(prevEndDate.getTime() - diffMs);

        const [currentReport, previousReport] = await Promise.all([
            getDailyReport(startDate, endDate, { child_id, staff_id }),
            getDailyReport(prevStartDate, prevEndDate, { child_id, staff_id })
        ]);

        const currentSummary = generateDailyLogReport(currentReport.dailyLogEntries);
        const previousSummary = generateDailyLogReport(previousReport.dailyLogEntries);

        const currentMetrics = {
            ...currentSummary,
            incident: currentReport.healthRecordEntries.length,
        };

        const {previousMetrics, percentageDiff}  = calculateDifference(previousSummary, previousReport, currentMetrics);

        res.status(200).json({
            currentPeriod: {
                startDate,
                endDate,
                summary: currentMetrics,
                log: currentReport.dailyLogEntries,
                healthRecord: currentReport.healthRecordEntries,
            },
            previousPeriod: {
                startDate: prevStartDate,
                endDate: prevEndDate,
                summary: previousMetrics,
                percentageDiff,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch daily report" });
    }
});


export default router;