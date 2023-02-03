import app from './server.js';

const isPro = process.env.NODE_ENV === 'production';
const Port = isPro ? 9186 : 9099;

app.listen(Port);
