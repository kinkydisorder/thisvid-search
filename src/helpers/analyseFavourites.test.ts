import { TVASS_USER_ID_STORAGE_KEY, ANALYSE_USERS_STORAGE_KEY } from './analyseFavourites';

describe('analyseFavourites storage keys', () => {
  it('should have the correct TVASS_USER_ID_STORAGE_KEY value', () => {
    expect(TVASS_USER_ID_STORAGE_KEY).toBe('tvass-user-id');
  });

  it('should have the correct ANALYSE_USERS_STORAGE_KEY value', () => {
    expect(ANALYSE_USERS_STORAGE_KEY).toBe('tvass-analyse-users');
  });
});
