export const USER_ROLE = {
  User: 'user',
  Admin: 'admin',
};
export type USER_ROLE = (typeof USER_ROLE)[keyof typeof USER_ROLE];
