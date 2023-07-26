const options = {
  timeZone: 'Europe/London',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
};

export function getRaceLocalTime(date) {
  // @ts-ignore
  const londonTime = new Date(date).toLocaleTimeString('en-US', options);
  return londonTime;
}
