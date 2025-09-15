import {baseApi} from "../../services/api";

interface User {
    id: string,
    first_name: string;
    last_name: string;
}

export const userAPi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<(User[]), void>({
            query: () => {
                return "/users"
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetUsersQuery } = userAPi;
