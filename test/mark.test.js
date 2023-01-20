import request from './server.js';

test('get marks', async () => {
  // const request = await import('./server.js')
  // console.log(request)
  const { body } = await request.get('/api/mark')
  // console.log(body)
  expect(body.code).toBe(200)
})