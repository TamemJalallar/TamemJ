import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';

const targetHost = process.env.LOCAL_PROXY_TARGET_HOST || '127.0.0.1';
const targetPort = Number(process.env.LOCAL_PROXY_TARGET_PORT || '3002');
const listenHost = process.env.LOCAL_PROXY_LISTEN_HOST || '127.0.0.1';
const listenPort = Number(process.env.LOCAL_PROXY_LISTEN_PORT || '3001');
const keyPath = process.env.LOCAL_PROXY_KEY_PATH;
const certPath = process.env.LOCAL_PROXY_CERT_PATH;

if (!keyPath || !certPath) {
  console.error('LOCAL_PROXY_KEY_PATH and LOCAL_PROXY_CERT_PATH are required.');
  process.exit(1);
}

const server = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  },
  (req, res) => {
    const upstream = http.request(
      {
        hostname: targetHost,
        port: targetPort,
        method: req.method,
        path: req.url,
        headers: {
          ...req.headers,
          host: `${targetHost}:${targetPort}`,
          connection: 'close'
        }
      },
      (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
        upstreamRes.pipe(res);
      }
    );

    upstream.on('error', (error) => {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`HTTPS proxy upstream error: ${error.message}`);
    });

    req.pipe(upstream);
  }
);

server.listen(listenPort, listenHost, () => {
  console.log(`HTTPS proxy listening on https://${listenHost}:${listenPort} -> http://${targetHost}:${targetPort}`);
});
