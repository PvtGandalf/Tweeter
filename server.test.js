/**
 * @jest-environment node
 */

/*
 * This file contains unit tests for the server you'll implement in server.js.
 * You should not modify anything in this file.
 *
 * Some of the testing setup in this file is adapted from Maximillian Schmitt:
 *
 * https://maximilianschmitt.me/posts/tutorial-rest-api-integration-testing-node-js/
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const portPID = require('port-pid');
const getPort = require('get-port');

/*
 * This is a list of all of the files to be served, which will be used below
 * to generate tests.
 */
const filesToTest = [
  [ 'index.html', 'text/html' ],
  [ 'style.css', 'text/css' ],
  [ 'index.js', 'application/javascript' ],
  [ '404.html', 'text/html' ]
];


/*
 * This function waits for a given URL to be reachable via GET request.  The
 * function retries sending a GET request to the URL once per second for at
 * most 10 seconds.  If all of those requests fail, the function gives up and
 * throws an Error.
 */
async function waitForURLReachable(url) {
  const timeout = 5000;
  const timeoutThreshold = Date.now() + timeout;
  while (true) {
    try {
      await axios.get(url);
      return true;
    } catch (err) {
      if (Date.now() > timeoutThreshold) {
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/*
 * This function launches the server at server.js in a child process, waits
 * the server to become available, and then returns the server, an API for
 * making queries to the server, and a function to tear down the server when
 * it's no longer needed.
 *
 * When the server is launched, the environment variable PORT is set to the
 * value specified in the argument `port`.  When checking whether the server
 * is available, we assume it listens on port 3000 if the environment variable
 * PORT is not specified.
 */
async function spawnTestServer(port) {
  const env = {
    PORT: port,
    PATH: process.env.PATH
  };
  const server = spawn('node', [ 'server.js' ], { env });

  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stderr);

  /*
   * Make sure server is listening on specified port (3000 by default) before
   * proceeding.
   */
  port = port || 3000;
  const baseURL = `http://localhost:${port}`;
  if (await waitForURLReachable(baseURL)) {
    const api = axios.create({ baseURL });
    return [ server, api, () => {
        server.kill();
        return new Promise(resolve => server.on('close', () => resolve()));
    }];
  } else {
    server.kill();
    return Promise.reject(new Error(`${baseURL} never became available`));
  }
}

/*
 * This set of tests makes sure the server listens on port 3000 if the
 * environment variable PORT is not specified.
 */
describe('port 3000', () => {
  let server, api, teardownServer;

  beforeAll(async () => {
    [ server, api, teardownServer ] = await spawnTestServer();
  }, 6000);

  test('listens on port 3000 by default', async () => {
    expect(server).toBeDefined();

    /*
     * Fetch the PID(s) of processes listening on port 3000, and make sure
     * the server's PID is there.
     */
    const { tcp } = await portPID(3000);
    expect(tcp).toContain(server.pid);
  });

  afterAll(async () => await teardownServer());
});


/*
 * This set of tests makes sure the server listens on the port specified by
 * the environment variable PORT.
 */
describe('specified port', () => {
  let server, api, teardownServer, port;

  beforeAll(async () => {
    /*
     * Randomly select an available port and launch the server on that port.
     */
    port  = await getPort();
    [ server, api, teardownServer ] = await spawnTestServer(port);
  }, 6000);

  test('listens on port specified by PORT environment variable', async () => {
    expect(server).toBeDefined();

    /*
     * Fetch the PID(s) of processes listening on the chosen port, and make
     * sure the server's PID is there.
     */
    const { tcp } = await portPID(port);
    expect(tcp).toContain(server.pid);
  });

  afterAll(async () => await teardownServer());
});


/*
 * This set of tests makes sure the server serves the correct content with the
 * correct Content-Type heaader and a 200 status code for each file in the
 * public/ directory.  Tests are also included for the root URL path ('/') and
 * for non-existent pages.
 */
describe('file serving', () => {
  const publicDir = path.join(__dirname, 'public');
  let server, api, teardownServer;

  beforeAll(async () => {
    [ server, api, teardownServer ] = await spawnTestServer();
  }, 6000);

  /*
   * Generate tests that compare served file content against actual content
   * of files from the public/ directory.
   */
  test.each(filesToTest)(`%s content is served correctly`, async (filename, contentType) => {
    expect(api).toBeDefined();

    /*
     * Make sure content served by the server matches the contents of the
     * corresponding file in the public/ directory.
     */
    const fileContents = fs.readFileSync(path.join(publicDir, filename), 'utf8');
    const response = await api.get(`/${filename}`);
    expect(response.data).toEqual(fileContents);
  });

  /*
   * Generate tests to make sure each file is served with status 200 and the
   * correct Content-Type header.
   */
  test.each(filesToTest)(`%s status and Content-Type (%s) are correct`, async (filename, contentType) => {
    expect(api).toBeDefined();

    const response = await api.get(`/${filename}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(contentType);
  });

  /*
   * Test to make sure public/index.html is correctly served on the root URL
   * path (/).
   */
  test('index.html is correctly served on root URL path /', async () => {
    const filename = 'index.html';
    const contentType = 'text/html';
    expect(api).toBeDefined();

    /*
     * Make sure content served by the server matches the contents of the
     * public/index.html and that response has correct status code and
     * Content-Type header.
     */
    const fileContents = fs.readFileSync(path.join(publicDir, filename), 'utf8');
    const response = await api.get('/');
    expect(response.data).toEqual(fileContents);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(contentType);
  });

  /*
   * Test to make sure that the 404 page is correctly returned with a 404
   * status for a bunch of URLs that shouldn't exist.
   */
  const badUrlsToTest = [
    '/index.htm',
    '/index',
    '/style',
    '/css',
    '/js',
    '/index.html1',
    '/thispagedoesnotexist',
    '/nosuchpage.html',
    '/somescript.js',
    '/anonexistentstylesheet.css',
    `/index.html${crypto.randomBytes(4).toString('hex')}`,
    `/${crypto.randomBytes(16).toString('hex')}`,
    `/${crypto.randomBytes(4).toString('hex')}/${crypto.randomBytes(8).toString('hex')}`
  ];
  test.each(badUrlsToTest)('404 page is correctly served for invalid URL (%s)', async (badUrl) => {
    const filename = '404.html';
    const contentType = 'text/html';
    expect(api).toBeDefined();

    /*
     * Make sure content served by the server matches the contents of the
     * public/index.html and that response has correct status code and
     * Content-Type header.
     */
    const fileContents = fs.readFileSync(path.join(publicDir, filename), 'utf8');
    const response = await api.get(badUrl, { validateStatus: () => true });
    expect(response.data).toEqual(fileContents);
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toEqual(contentType);
  });

  afterAll(async () => await teardownServer());
});
