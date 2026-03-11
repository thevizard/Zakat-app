import { useQuery } from "@tanstack/react-query";
import { NisabData } from "@/types/zakat.types";

async function fetchNisabData(): Promise<NisabData> {
  const response = await fetch("/api/nisab");
  if (!response.ok) throw new Error("Failed to fetch nisab data");
  return response.json();
}

export function useNisab() {
  return useQuery({
    queryKey: ["nisab"],
    queryFn: fetchNisabData,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: 2,
  });
}
