import request from './server.js';

test('get blogs', async () => {
  // const request = await import('./server.js')
  // console.log(request)
  const { body } = await request.get('/api/blog')
  // console.log(body)
  expect(body.code).toBe(200);
})