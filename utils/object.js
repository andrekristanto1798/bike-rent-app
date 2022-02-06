export const safeJSONParseArrayStrings = (str) => {
  try {
    const result = JSON.parse(str);
    if (!Array.isArray(result) || result.length === 0) {
      return undefined;
    }
    if (result.some((el) => typeof el !== "string")) {
      return undefined;
    }
    return result;
  } catch (e) {
    return undefined;
  }
};
