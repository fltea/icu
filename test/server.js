import supertest from 'supertest';
import app from '../server/app';

 const request = supertest(app.callback());
 
export default request;