type AdminEntry = {
  full_name: string;
  email: string;
};

export const uniqueAdminEntries = (entries: AdminEntry[]) => {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    const key = entry.email.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
