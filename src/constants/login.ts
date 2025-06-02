export const LOGIN = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION_MS: 0.5 * 60 * 1000,
  FAILED_ATTEMPTS_COUNT_KEY: "failedLoginAttempts",
  LOGIN_LOCKOUT_UNTIL_KEY: "loginLockoutUntil",
};
