
export const smallUrl = (url: string): string =>
  url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

export const getHostName = (url: string): string =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/^([^/]+)\/.+$/, "$1");

export const getLastUrlSegment = (url: string): string =>
  url.substring(url.lastIndexOf("/") + 1);

export const sortByKey = (key: string) => (a: any, b: any) => {
  if (a[key] > b[key]) {
    return 1;
  } else if (a[key] < b[key]) {
    return -1;
  }
  return 0;
};

export const isToolEnabled = (name: DashlordTool): boolean => {
  const dashlordConfig: DashlordConfig  = require("./config.json");
  const hasTools = dashlordConfig.tools && dashlordConfig.tools.length;
  return !hasTools || !!(dashlordConfig.tools && dashlordConfig.tools.includes(name));
};
