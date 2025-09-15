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
        getDailyReport: builder.query<DailyReport,
            { start_date: string, end_date: string, child_id?: string, staff_id?: string, user_id?: string  }>({
            query: ({ start_date, end_date, child_id, staff_id, user_id }) => {
                const params = new URLSearchParams({
                    start_date,
                    end_date,
                });

                if (child_id) params.append("child_id", child_id);
                if (staff_id) params.append("staff_id", staff_id);
                if (user_id) params.append("user_id", user_id);

                return `/report/daily?${params.toString()}`;
            },
        })
    }),
    overrideExisting: false,
});

export const { useGetGeneralReportQuery, useGetDailyReportQuery } = reportAPi;
