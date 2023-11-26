export const getErrorName = (errorMessage: string) => {
  const errorStartIndex = errorMessage.indexOf('throw new Error("') + 'throw new Error("'.length;
  const errorEndIndex = errorMessage.indexOf('"', errorStartIndex);
  
  if (errorStartIndex !== -1 && errorEndIndex !== -1) {
    return errorMessage.substring(errorStartIndex, errorEndIndex);
  } else {
    return "Something went wrong. Try again.";
  }
}
