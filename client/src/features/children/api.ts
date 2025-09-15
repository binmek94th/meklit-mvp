import {baseApi} from "../../services/api";

interface Children {
    id: string,
    name: string;
    parent_name: string;
    email: string;
    address: string;
}

export const childrenAPi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChildren: builder.query<(Children[]), void>({
            query: () => {
                return "/children"
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetChildrenQuery } = childrenAPi;
