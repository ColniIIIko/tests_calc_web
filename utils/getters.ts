export const getErrorName = (errorMessage: string) => {
  const errorStartIndex = errorMessage.indexOf('Error: ') + '"Error:"'.length - 1;
  const errorEndIndex = errorMessage.indexOf('at validator', errorStartIndex);
  
  if (errorStartIndex !== -1 && errorEndIndex !== -1) {
    return errorMessage.substring(errorStartIndex, errorEndIndex);
  } else {
    return errorMessage;
  }
}
