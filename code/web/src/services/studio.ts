import useSWR from "swr";

import { useCallback } from "react";
import { debounce } from "lodash-es";

import { api } from "@services/api";

export default function useStudio(id: string) {
  const { data: sections, isLoading, mutate } = useSWR<Section[]>(`/courses/${id}/sections`);

  const handleSectionChange = useCallback(async (current: string, before: string | null) => {
    await api.patch(`sections/${current}/order`, { sectionBefore: before });

    mutate();
  }, []);

  const handleVideoChange = useCallback(async (current: string, before: string | null) => {
    await api.patch(`videos/${current}/order`, { videoBefore: before });

    mutate();
  }, []);

  const handleVideoChangeSection = useCallback(async (current: string, section: string) => {
    await api.patch(`videos/${current}/order`, { section });

    mutate();
  }, []);

  const handleCreateSection = useCallback(async (name: string) => {
    await api.post(`courses/${id}/sections`, { name });

    mutate();
  }, []);

  const handleDeleteSection = useCallback(async (id: string) => {
    await api.delete(`sections/${id}`);

    mutate();
  }, []);

  const handleUpdateSection = useCallback(
    debounce(async (id: string, name: string) => {
      await api.patch(`sections/${id}`, { name });
    }, 1500),
    []
  );

  return {
    sections,
    isLoading,
    handleSectionChange,
    handleVideoChange,
    handleVideoChangeSection,
    handleCreateSection,
    handleDeleteSection,
    handleUpdateSection,
  };
}
