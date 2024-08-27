import { graphQLClient } from "@/clients/api";
import { User } from "@/gql/graphql";
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => graphQLClient.request(getCurrentUserQuery),
  });

  return { ...query, user: query.data?.getCurrentUser };
};

export const useGetUserById = (id: string) => {
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const data = await graphQLClient.request(getUserByIdQuery, { id });
      return data.getUserById;
    },
    enabled: !!id, // Ensure the query doesn't run unless `id` is provided
  });

  return { ...query, user: query.data as User };
};
