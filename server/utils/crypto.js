import crypto from 'crypto';

const hashstring = (string) => {
  const hash = crypto.createHash('sha256');
  hash.update(string, 'utf8');
  return hash.digest('hex');
};
export default hashstring;
