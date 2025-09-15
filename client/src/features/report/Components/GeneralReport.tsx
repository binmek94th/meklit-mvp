import { useGetGeneralReportQuery } from "../api.ts";

const GeneralReport = () => {
    const { data: generalReport, isLoading, error } = useGetGeneralReportQuery();

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-gray-200 rounded-xl h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414
                                       1.414L8.586 10l-1.293 1.293a1 1 0 101.414
                                       1.414L10 11.414l1.293 1.293a1 1 0
                                       001.414-1.414L11.414 10l1.293-1.293a1
                                       1 0 00-1.414-1.414L10 8.586
                                       8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error loading report data
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            name: "Staff Members",
            value: generalReport?.staffCount || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0
                           00-5.356-1.857M17 20H7m10
                           0v-2c0-.656-.126-1.283-.356-1.857M7
                           20H2v-2a3 3 0
                           015.356-1.857M7
                           20v-2c0-.656.126-1.283.356-1.857m0
                           0a5.002 5.002 0
                           019.288 0M15 7a3 3 0
                           11-6 0 3 3 0 016
                           0zm6 3a2 2 0
                           11-4 0 2 2 0 014
                           0zM7 10a2 2 0
                           11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
            color: "rgb(var(--color-blue))",
            bgColor: "rgb(var(--color-blue-bg))",
            textColor: "rgb(var(--color-blue))",
        },
        {
            name: "Children",
            value: generalReport?.childrenCount || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0
                           01-5.656 0M9
                           10h.01M15
                           10h.01M21
                           12a9 9 0
                           11-18 0 9 9 0
                           0118 0z"
                    />
                </svg>
            ),
            color: "rgb(var(--color-green))",
            bgColor: "rgb(var(--color-green-bg))",
            textColor: "rgb(var(--color-green))",
        },
        {
            name: "Total Users",
            value: generalReport?.usersCount || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0
                           110 5.292M15
                           21H3v-1a6 6 0
                           0112 0v1zm0
                           0h6v-1a6 6 0
                           00-9-5.197m13.5-9a2.5
                           2.5 0 11-5 0 2.5 2.5
                           0 015 0z"
                    />
                </svg>
            ),
            color: "rgb(var(--color-purple))",
            bgColor: "rgb(var(--color-purple-bg))",
            textColor: "rgb(var(--color-purple))",
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">General Report</h1>
                    <p className="text-gray-600">Overview of key metrics and statistics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            style={{ backgroundColor: stat.bgColor }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.name}
                                    </p>
                                    <p
                                        className="text-3xl font-bold"
                                        style={{ color: stat.textColor }}
                                    >
                                        {stat.value.toLocaleString()}
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-lg text-white"
                                    style={{ backgroundColor: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${Math.min(
                                                    (stat.value /
                                                        Math.max(
                                                            ...stats.map((s) => s.value)
                                                        )) * 100,
                                                    100
                                                )}%`,
                                                backgroundColor: stat.color,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {(
                                            (stat.value /
                                                stats.reduce(
                                                    (sum, s) => sum + s.value,
                                                    0
                                                )) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Staff Members</span>
                                <span className="font-semibold text-gray-900">
                                    {generalReport?.staffCount?.toLocaleString() || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Children</span>
                                <span className="font-semibold text-gray-900">
                                    {generalReport?.childrenCount?.toLocaleString() || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Total Users</span>
                                <span className="font-semibold text-gray-900">
                                    {generalReport?.usersCount?.toLocaleString() || 0}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Quick Insights
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>
                                    • Staff to children ratio:{" "}
                                    {generalReport?.childrenCount &&
                                    generalReport?.staffCount
                                        ? `1:${Math.round(
                                            generalReport.childrenCount /
                                            generalReport.staffCount
                                        )}`
                                        : "N/A"}
                                </p>
                                <p>
                                    • Total community size:{" "}
                                    {(
                                        (generalReport?.staffCount || 0) +
                                        (generalReport?.childrenCount || 0) +
                                        (generalReport?.usersCount || 0)
                                    ).toLocaleString()}{" "}
                                    members
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralReport;
