import https from 'https';

const BASE_URL = 'https://vuonaispace.onrender.com/api/v1';

const ENDPOINTS = [
  { name: 'Ideas Board API', path: '/ideas', expectedStatus: [200] },
  { name: 'Projects Room API', path: '/projects', expectedStatus: [200] },
  { name: 'Equipment API', path: '/equipment', expectedStatus: [200] },
  { name: 'Events API', path: '/events', expectedStatus: [200] },
  { name: 'Mentors API', path: '/mentors', expectedStatus: [200, 401] },
  { name: 'Labs API', path: '/labs', expectedStatus: [200] },
  { name: 'User Profile API', path: '/profiles/me', expectedStatus: [401] }, // Expected 401 without auth token
  { name: 'Notifications API', path: '/notifications', expectedStatus: [401] },
  { name: 'Admin Metrics API', path: '/admin/metrics', expectedStatus: [401] }
];

async function checkEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  return new Promise((resolve) => {
    const startTime = Date.now();
    https.get(url, (res) => {
      const duration = Date.now() - startTime;
      const pass = endpoint.expectedStatus.includes(res.statusCode);
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        pass
      });
    }).on('error', (err) => {
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'ERR',
        error: err.message,
        pass: false
      });
    });
  });
}

async function runHealthCheck() {
  console.log('====================================================');
  console.log('   VUON AI SPACE - API HEALTH CHECKER (4 PILLARS)   ');
  console.log('====================================================');
  console.log(`Targeting Backend: ${BASE_URL}\n`);

  const results = [];
  for (const ep of ENDPOINTS) {
    const res = await checkEndpoint(ep);
    results.push(res);
    const badge = res.pass ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${badge} ${ep.name.padEnd(22)} | Path: ${ep.path.padEnd(16)} | Status: ${String(res.status).padEnd(5)} | Time: ${res.duration || 'N/A'}`);
  }

  console.log('\n====================================================');
  const totalPassed = results.filter(r => r.pass).length;
  console.log(`SUMMARY: ${totalPassed}/${results.length} Endpoints responded with expected contracts.`);
  console.log('====================================================\n');
}

runHealthCheck();
