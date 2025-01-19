export const getLast48HoursRange = () => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  return {
    from: last24Hours.toISOString(),
    to: now.toISOString(),
  };
};