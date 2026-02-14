export function useLiveUpdateConfig() {
  return {
    refetchInterval: 10000, // 10 seconds for faster order updates
    refetchOnWindowFocus: true,
  };
}
