export const getErrorName = (errorMessage: string) => {
  console.log(errorMessage)
  const errorStartIndex = errorMessage.indexOf('Error: ') + '"Error:"'.length - 1;
  const errorEndIndex = errorMessage.indexOf('at validator', errorStartIndex);
  
  if (errorStartIndex !== -1 && errorEndIndex !== -1) {
    return errorMessage.substring(errorStartIndex, errorEndIndex);
  } else {
    return "Something went wrong. Try again.";
  }
}
