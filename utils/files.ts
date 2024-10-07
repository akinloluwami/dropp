export const readableSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return `${Number(size)?.toFixed(2)} ${units[i]}`;
};

export const truncateFromEnd = (str: string, length: number) => {
  if (str.length > length) {
    return `...${str.substring(str.length - length)}`;
  }
  return str;
};
