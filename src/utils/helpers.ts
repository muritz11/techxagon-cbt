// import { showError } from "./Alert";

export const capitalizeFirstText = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeText = (str: string) => {
  if (str === undefined) {
    return "";
  }

  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const checkEmptyFields = (fields: any) => {
  let err = false;
  Object.keys(fields).forEach((key: string) => {
    if (
      fields[key] === "" ||
      fields[key] === undefined ||
      fields[key] === null
    ) {
      //   showError(capitalizeFirstText(`${key?.replace(/_/g, " ")} is required`));
      err = true;
    }
  });

  return err;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text?.length <= maxLength) {
    return text;
  } else {
    return text?.substring(0, maxLength) + "...";
  }
};

export const countWords = (str: string) => {
  if (!str.trim()) {
    return 0;
  }

  return str?.trim()?.split(/\s+/).length;
};

// formats date to yyyy-mm-dd  local time
// for setting&submitting date
export const dateSubmitFormat = (date: string | null) => {
  if (!date) {
    return null;
  }

  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

// formats date to dd-mm-yyyy  local time
export function dateOnlySubmitFormat(date: string | number) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}

// formats dateTime to yyyy-mm-dd:HH:MM  local time
export function dateTimeSubmitFormat(date: string | number) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hours = String(d.getHours()),
    minutes = String(d.getMinutes());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;

  return [day, month, year].join("-") + `:${hours}:${minutes}`;
}

export function formatDateToISO(dateStr: string) {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

// formats date to dd-mm-yyyy utc
// for displaying
export const formatDateToLocaleString = (date: string) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
};
