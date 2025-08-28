export const formatPostCount = (count: number): string => {
  if (count === 1) return '1 post';
  return `${count} posts`;
};

export const formatViewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes === 0) return '0 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};

export const formatPublishStatus = (status: string): string => {
  switch (status) {
    case 'published':
      return 'Published';
    case 'draft':
      return 'Draft';
    case 'archived':
      return 'Archived';
    default:
      return status;
  }
};

export const formatGrowthPercentage = (growth: number): string => {
  const sign = growth >= 0 ? '+' : '';
  return `${sign}${growth}% from last month`;
};