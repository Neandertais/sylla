import useSWR from "swr";

export default function useUser(username?: string) {
  const url = username ? `/users/${username}` : "/user";

  const { data, error, isLoading } = useSWR(url, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return { user: data?.user as User , error, isLoading };
}
