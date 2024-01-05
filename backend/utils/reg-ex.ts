export const regexNumber = /^[0-9]*$/;

export const regexGeneric = /^[a-zA-Z0-9\s,.'\-+éàè?î!âôêû:\/ù]{1,}$/;

export const setRandomNumber = (min: number, max: number) => {
  return Math.trunc(Math.random() * (max - min + 1) + min);
};
