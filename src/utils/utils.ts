export default function GetErrorMessage(error: unknown): string {
  let errorMsg = '';
  if (error instanceof Error) {
    errorMsg = error.message;
  } else if (typeof error === 'string') {
    errorMsg = error;
  } else {
    errorMsg = 'Unknown error occurred!';
  }
  return errorMsg;
}
