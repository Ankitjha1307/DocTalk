/**
 * API Testing Utility
 * Use this to verify backend connectivity during development
 * 
 * Usage in browser console:
 * import { testAPIConnection } from '@/lib/test-api'
 * testAPIConnection()
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const testAPIConnection = async () => {
  console.log('[API Test] Starting API connectivity tests...');
  console.log('[API Test] Backend URL:', API_BASE_URL);

  const tests = [
    {
      name: 'Health Check',
      endpoint: '/api/health',
      method: 'GET',
    },
    {
      name: 'Medicines List (requires auth)',
      endpoint: '/api/medicines',
      method: 'GET',
    },
    {
      name: 'Dashboard Summary (requires auth)',
      endpoint: '/api/dashboard/summary',
      method: 'GET',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const url = `${API_BASE_URL}${test.endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: test.method,
        headers,
      });

      if (response.ok) {
        console.log(`✅ ${test.name} - ${response.status}`);
        passed++;
      } else {
        console.log(`⚠️ ${test.name} - ${response.status} (Expected: 401 if not authenticated)`);
        if (response.status === 401) {
          passed++;
        } else {
          failed++;
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n[API Test] Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('[API Test] ✅ Backend is reachable!');
  } else {
    console.log('[API Test] ❌ Some tests failed. Check backend status.');
  }
};

export const testEndpoint = async (endpoint, method = 'GET', body = null) => {
  console.log(`[API Test] Testing: ${method} ${endpoint}`);

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`[API Test] Status: ${response.status}`);
    console.log('[API Test] Response:', data);

    return { status: response.status, data };
  } catch (error) {
    console.error('[API Test] Error:', error.message);
    return { error: error.message };
  }
};

/**
 * Quick test commands:
 * 
 * In browser console, paste:
 * 
 * // Test basic connectivity
 * import { testAPIConnection } from '@/lib/test-api'
 * testAPIConnection()
 * 
 * // Test specific endpoint
 * import { testEndpoint } from '@/lib/test-api'
 * testEndpoint('/api/medicines/search?q=aspirin')
 * 
 * // Test with body
 * testEndpoint('/api/medicines/interactions', 'POST', {
 *   medicine_ids: [1, 2, 3]
 * })
 */
