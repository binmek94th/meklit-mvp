import React from "react";
import { Users, UserCheck, User, ChevronDown } from "lucide-react";
import {useGetUsersQuery} from "../../user/api.ts";
import {useGetStaffsQuery} from "../../staff/api.ts";
import {useGetChildrenQuery} from "../../children/api.ts";

interface Filters {
    childId?: string;
    staffId?: string;
    userId?: string;
}

interface FilterSelectsProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterSelects: React.FC<FilterSelectsProps> = ({ filters, setFilters }) => {
    const { data: children } = useGetChildrenQuery();
    const { data: staffs } = useGetStaffsQuery();
    const { data: users } = useGetUsersQuery();

    const handleFilterChange = (filterType: keyof Filters, value: string) => {
        setFilters({
            ...filters,
            [filterType]: value || undefined,
        });
    };

    const CustomSelect = ({
                              value,
                              onChange,
                              options,
                              placeholder,
                              icon: Icon,
                              label,
                          }: {
        value: string | undefined;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        options: any[];
        placeholder: string;
        icon: React.FC<any>;
        label: string;
    }) => (
        <div className="relative flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <select
                    value={value || ""}
                    onChange={onChange}
                    className="block w-full pl-10 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent rounded-lg bg-white shadow-sm transition-all duration-200 hover:border-gray-400 appearance-none"
                >
                    <option value="">{placeholder}</option>
                    {options?.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name || option.first_name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-3 gap-6">
                <CustomSelect
                    value={filters.childId}
                    onChange={(e) => handleFilterChange("childId", e.target.value)}
                    options={children || []}
                    placeholder="All Children"
                    icon={Users}
                    label="Children"
                />
                <CustomSelect
                    value={filters.staffId}
                    onChange={(e) => handleFilterChange("staffId", e.target.value)}
                    options={staffs || []}
                    placeholder="All Staff"
                    icon={UserCheck}
                    label="Staff Members"
                />
                <CustomSelect
                    value={filters.userId}
                    onChange={(e) => handleFilterChange("userId", e.target.value)}
                    options={users || []}
                    placeholder="All Users"
                    icon={User}
                    label="Users"
                />
            </div>
        </div>
    );
};

export default FilterSelects;
