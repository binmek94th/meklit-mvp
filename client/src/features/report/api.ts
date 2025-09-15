import {baseApi} from "../../services/api";

interface GeneralReport {
    staffCount: number;
    childrenCount: number;
    usersCount: number;
}

interface Summary {
    meal: number,
    nap: number,
    mood: number
    diaper: number
    incident: number
}

interface Child {
    name: string,
    parent_name: string,
    address: string,
    email: string,
}

interface Staff {
    first_name: string,
    last_name: string,
}

interface DailyReport {
    currentPeriod: {
        startDate: string,
        endDate: string,
        summary: Summary,
        log: {
            id: string,
            timestamp: string,
            type: string,
            details: string,
            childId: string,
            staffId: string,
            child: Child,
            staff: Staff
        }[],
        healthRecord: {
            type: string,
            id: string,
            timestamp: string,
            details: string,
            actionTaken: string,
            childId: string,
            recordedByUserId: string,
            child: Child,
            recordedByUser: Staff,
        }[],
    },
    previousPeriod: {
        startDate: string,
        endDate: string,
        summary: Summary,
        percentageDiff: Summary,
    },
}

export const reportAPi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGeneralReport: builder.query<(GeneralReport), void>({
            query: () => {
                return "/report/general"
            },
        }),
        getDailyReport: builder.query<DailyReport, { start_date: string, end_date: string }>({
            query: ({start_date, end_date}) =>
                `/report/daily?start_date=${start_date}&end_date=${end_date}`,
        }),
    }),
    overrideExisting: false,
});

export const { useGetGeneralReportQuery, useGetDailyReportQuery } = reportAPi;
