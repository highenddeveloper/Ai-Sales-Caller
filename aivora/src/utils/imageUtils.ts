export const FALLBACK_IMAGE = "/images/placeholder.jpg";

export const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url || typeof url !== "string") return false;

  try {
    new URL(url, window.location.href);
    return true;
  } catch {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  }
};

export const getSafeImageUrl = (url: string | undefined): string => {
  return isValidImageUrl(url) ? url : FALLBACK_IMAGE;
};

export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
    setTimeout(() => resolve(false), 5000);
  });
};
