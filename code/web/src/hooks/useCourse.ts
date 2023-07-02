import useSWR from "swr";

export default function useCourse(id: string) {
  const { data, error, isLoading } = useSWR(`/courses/${id}`, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return { course: data?.course as Course, error, isLoading };
}
