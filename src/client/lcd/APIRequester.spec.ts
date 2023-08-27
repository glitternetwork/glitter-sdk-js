import axios from 'axios';
import { APIRequester } from './APIRequester';

jest.mock('axios');
const mockedAxios = jest.mocked(axios, true);

describe('APIRequester', () => {
  beforeAll(() => {
    // @ts-expect-error
    axios.create.mockReturnThis();
  });

  it('accept a standard URL', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const request = new APIRequester('https://api.xian.glitter.link');
    await request.get('/foo');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.xian.glitter.link/foo',
      {
        params: {},
      }
    );
  });

  it('accept a deep URL', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const request = new APIRequester('https://api.xian.glitter.link/bar');
    await request.get('/foo');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.xian.glitter.link/bar/foo',
      { params: {} }
    );
  });

  it('accept an URL with search params', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const request = new APIRequester('https://api.xian.glitter.link?key=123');
    await request.get('/foo');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.xian.glitter.link/foo?key=123',
      { params: {} }
    );
  });

  it('accept an URL with credentials', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const request = new APIRequester('https://:123@lcd.glitter.dev');
    await request.get('/foo');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.xian.glitter.link/foo',
      { params: {} }
    );
  });
});
