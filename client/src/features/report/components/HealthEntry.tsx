import {Clock, User} from "lucide-react";
import {formatTime} from "../../../utils/date.ts";

const HealthEntry = ({ entry }: any) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              entry.type === "Medication" ? "text-white" : "bg-red-100 text-red-800"
          }`}>{entry.type}</span>
                <span className="ml-2 text-sm text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {formatTime(entry.timestamp)}
          </span>
            </div>
        </div>
        <p className="text-gray-900 mb-2">{entry.details}</p>
        <p className="text-sm text-gray-700 mb-2"><strong>Action Taken:</strong> {entry.actionTaken}</p>
        <div className="flex items-center text-sm text-gray-600">
            <User className="h-3 w-3 mr-1" />
            <span className="mr-4">Child: {entry.child?.name}</span>
            <span>Recorded by: {entry.recordedByUser?.first_name} {entry.recordedByUser?.last_name}</span>
        </div>
    </div>
);

export default HealthEntry;