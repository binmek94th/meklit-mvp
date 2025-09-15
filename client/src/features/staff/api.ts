import {baseApi} from "../../services/api";

interface Staff {
    id: string,
    first_name: string;
    last_name: string;
}

export const staffAPi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStaffs: builder.query<(Staff[]), void>({
            query: () => {
                return "/staffs"
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetStaffsQuery } = staffAPi;
