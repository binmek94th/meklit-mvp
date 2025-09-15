import GeneralReport from "./components/GeneralReport.tsx";
import { DatePicker } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DailyReport from "./components/SpecificReport.tsx";
import {Calendar} from "lucide-react";

const Report = () => {
    const { RangePicker } = DatePicker;
    const today = dayjs();
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([today, today]);

    const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
        } else {
            setDateRange([today, today]);
        }
    };

    return (
        <div className="space-y-6">
            <GeneralReport />
            <div className="m-4">
                <div className="m-4">
                    <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-900">Daily Report</h1>
                    </div>
                    <RangePicker
                        value={dateRange}
                        onChange={handleChange}
                        format="YYYY-MM-DD"
                        allowClear
                    />
                </div>
                <DailyReport
                    start_date={dateRange[0].format("YYYY-MM-DD")}
                    end_date={dateRange[1].format("YYYY-MM-DD")}
                />
            </div>
        </div>
    );
};

export default Report;
