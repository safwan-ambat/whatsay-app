export const getLast24HoursRange = () => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
    return {
      from: last24Hours.toISOString(),
      to: now.toISOString(),
    };
  };
  