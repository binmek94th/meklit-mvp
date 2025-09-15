import { useState } from "react";
import {Activity, Heart, TrendingUp, AlertCircle, FileText, TrendingDown} from "lucide-react";
import { useGetDailyReportQuery } from "../api.ts";
import FilterSelects from "./Filter.tsx";
import LogEntry from "./LogEntry.tsx";
import HealthEntry from "./HealthEntry.tsx";

interface Props {
    start_date: string,
    end_date: string,
}

interface Filters {
    childId?: string;
    staffId?: string;
    userId?: string;
}

const DailyReport = ({ start_date, end_date }: Props) => {
    const [activeTab, setActiveTab] = useState("summary");
    const [filters, setFilters] = useState<Filters>({
        childId: undefined,
        staffId: undefined,
        userId: undefined,
    });
    const { data, isLoading, error } = useGetDailyReportQuery(
        { start_date, end_date, child_id: filters.childId, staff_id: filters.staffId, user_id: filters.userId, },);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const summaryKeys: { key: keyof typeof currentPeriod.summary; label: string }[] = [
        { key: "meal", label: "Meals" },
        { key: "nap", label: "Naps" },
        { key: "mood", label: "Mood" },
        { key: "diaper", label: "Diaper Changes" },
        { key: "incident", label: "Incidents" },
    ];

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-red-800 font-medium">Error loading report</h3>
                </div>
                <p className="text-red-700 mt-1">Unable to fetch the daily report data.</p>
            </div>
        );
    }

    if (!data) return null;

    const { currentPeriod, previousPeriod } = data;


    const getPercentageColor = (value: any) => (value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600");
    const getPercentageIcon = (value: any) => (value > 0 ? <TrendingUp className="h-4 w-4" /> : value < 0 ? <TrendingDown className="h-4 w-4" /> : null);

    const TabButton = ({ id, label, Icon }: {id: string, label: string, Icon: any}) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === id ? "bg-blue-100 text-blue-700 border border-blue-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
        >
            <Icon className="h-4 w-4 mr-2" />
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="max-w-7xl mx-auto p-6">
                <FilterSelects filters={filters} setFilters={setFilters}></FilterSelects>
            </div>
            <div className="flex space-x-2 mb-6">
                <TabButton id="summary" label="Summary" Icon={FileText} />
                <TabButton id="activities" label="Activity Log" Icon={Activity} />
                <TabButton id="health" label="Health Records" Icon={Heart} />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                {activeTab === "summary" && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Period Summary</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Comparison to Previous Period</h4>
                                <div className="space-y-2 text-sm">
                                    {summaryKeys.map(({ key, label }) => (
                                        <div key={key} className="flex justify-between items-center">
                                            <span className="text-gray-600">{label}</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="font-medium">{currentPeriod.summary[key]}</span>
                                                <div className={`flex items-center ${getPercentageColor(previousPeriod.percentageDiff[key])}`}>
                                                    {getPercentageIcon(previousPeriod.percentageDiff[key])}
                                                    <span className="ml-1 font-medium">
            {previousPeriod.percentageDiff[key] > 0 ? "+" : ""}
                                                        {previousPeriod.percentageDiff[key].toFixed(1)}%
          </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "activities" && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Activity Log ({currentPeriod.log?.length || 0} entries)
                        </h3>
                        {currentPeriod.log?.length > 0 ? (
                            <div className="space-y-3">
                                {currentPeriod.log.map((entry) => <LogEntry key={entry.id} entry={entry} />)}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No activity logs recorded for this period.</div>
                        )}
                    </div>
                )}

                {activeTab === "health" && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Health Records ({currentPeriod.healthRecord?.length || 0} entries)
                        </h3>
                        {currentPeriod.healthRecord?.length > 0 ? (
                            <div className="space-y-3">
                                {currentPeriod.healthRecord.map((entry) => <HealthEntry key={entry.id} entry={entry} />)}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No health records for this period.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyReport;
