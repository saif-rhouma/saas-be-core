/* eslint-disable prettier/prettier */
export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  STAFF = 'STAFF',
}

export const payloadMock = {
  reminderDate: '2024-09-25T13:47:03.000Z',
  title: 'dsqd',
  description: 'dqsd',
  createdBy: {
    id: 1,
    email: 'test1@email.com',
    password: 'f80869d2106bdb95.81a9124ddde9c3e31ae0edd14a822480ada77db1dd81d54fcbcd18be6a3be24a',
    firstName: 'Saifeddine',
    lastName: 'RHOUMA',
    phoneNumber: '93414888',
    accountType: 'Free',
    avatar: null,
    applicationThemeSetting: null,
    address: null,
    isActive: true,
  },
  application: {
    id: 1,
    name: 'MainApp Orig 3',
    appLogo: null,
    favicon: null,
    description: null,
    email: null,
    phoneNumber: null,
    printerPOS: 'A4',
    currencySymbol: 'Euro',
    taxPercentage: 15,
    taxNumber: null,
    address: null,

    financialYear: null,
  },
  isNotified: true,
  file: null,
  id: 31,
  createTime: '2024-09-25T13:46:46.000Z',
  updateTime: '2024-09-25T13:46:46.000Z',
};
