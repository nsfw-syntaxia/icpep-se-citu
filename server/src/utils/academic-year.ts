// Philippine school year typically starts mid-year (~June/July), so anything
// from June onward counts as the start of that year's academic year.
// Mirrors client/src/app/utils/academic-year.ts.
export const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() >= 5 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};
