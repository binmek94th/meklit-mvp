import {Clock, User} from "lucide-react";
import {formatTime} from "../../../utils/date.ts";

const LogEntry = ({ entry }: any) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center mb-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                entry.type === "Activity" ? "bg-blue-100 text-blue-800" :
                    entry.type === "Meal" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
            }`}>{entry.type}</span>
                    <span className="ml-2 text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {formatTime(entry.timestamp)}
            </span>
                </div>
                <p className="text-gray-900 mb-2">{entry.details}</p>
                <div className="flex items-center text-sm text-gray-600">
                    <User className="h-3 w-3 mr-1" />
                    <span className="mr-4">Child: {entry.child?.name}</span>
                    <span>Staff: {entry.staff?.first_name} {entry.staff?.last_name}</span>
                </div>
            </div>
        </div>
    </div>
);

export default LogEntry;