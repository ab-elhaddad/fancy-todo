import jwt from 'jsonwebtoken';
import { config } from '../../configuration/config';
import shareList from '../../helpers/generateListURL';

jest.mock('jsonwebtoken');

describe('generateListURL', () => {
  const mockToken = 'mockToken';
  const mockUrl = 'http://localhost:3000/lists/mockToken';
  const mockListId = 1;

  beforeAll(() => {
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('shareList', () => {
    it('should generate a shareable URL for a given list ID', () => {
      const result = shareList(mockListId);

      expect(jwt.sign).toHaveBeenCalledWith(String(mockListId), config.jwtSecretKey);
      expect(result).toBe(mockUrl);
    });
  });
});
