export const setEnv = () => {
  const ENV = process.argv.filter((v) => v.includes('='));
  ENV.forEach((e) => {
    const evns = e.split('=');
    process.env[evns.shift()] = evns.pop();
  });
};
