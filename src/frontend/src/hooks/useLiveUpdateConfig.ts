export function useLiveUpdateConfig() {
  return {
    refetchInterval: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  };
}
