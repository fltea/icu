import supertest from 'supertest';
import app from '../server/server';

const request = supertest(app.callback());

export default request;
