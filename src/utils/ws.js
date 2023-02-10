const sendWS = (url) => {
  let server;
  let link = `ws://${location.host}/api/websockets`;
  if (url) {
    link += `?${url}`;
  }
  if (WebSocket) {
    server = new WebSocket(link);
    // console.log('sendWS', server);
  }
  return server;
};

export default sendWS;
