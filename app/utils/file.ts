
export const isImageFile = (fn: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  const fileExtension = fn.slice(fn.lastIndexOf("."));
  return imageExtensions.includes(fileExtension.toLowerCase());
}

