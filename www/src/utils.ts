const dashlordConfig: DashlordConfig  = require("./config.json");

export const smallUrl = (url: string) =>
  url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

export const getHostName = (url: string) =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/^([^/]+)\/.+$/, "$1");

export const sortByKey = (key: string) => (a: any, b: any) => {
  if (a[key] > b[key]) {
    return 1;
  } else if (a[key] < b[key]) {
    return -1;
  }
  return 0;
};

/**
 *
 * @param {DashlordTool} name file name to export to public website
 *
 * @returns {void}
 */
export const isToolEnabled = (name: string) => {
  // @ts-ignore
  const hasTools = dashlordConfig.tools && dashlordConfig.tools.length;
  // @ts-ignore
  return !hasTools || dashlordConfig.tools.includes(name);
};
