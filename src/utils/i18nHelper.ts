export type I18nString = string | { pt: string; en: string };

export const getLocalized = (content: I18nString | undefined | null, locale: string): string => {
  if (!content) return "";

  // If it's a simple string (legacy data or single language), return it
  if (typeof content === "string") {
    return content;
  }

  // If it's an object, try to get the requested locale
  if (typeof content === "object") {
    // Cast to any to access dynamic keys safely
    const localized = (content as any)[locale];
    
    // Fallback to 'pt' or 'en' if the specific locale isn't found
    if (localized) return localized;
    if ((content as any)["pt"]) return (content as any)["pt"];
    if ((content as any)["en"]) return (content as any)["en"];
    
    // If nothing matches, return the first available value or empty
    const keys = Object.keys(content);
    if (keys.length > 0) return (content as any)[keys[0]];
  }

  return "";
};
