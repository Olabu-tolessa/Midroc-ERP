import React, { useState } from 'react';
import { DATABASE_TYPE } from '../../lib/database';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string, method = 'GET', data?: any) => {
    const API_BASE_URL = 'http://localhost/midroc-erp/backend/api';
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
      const result = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: result,
        error: response.ok ? null : result.error || 'Request failed'
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    // Test 1: Basic API connectivity
    console.log('🧪 Testing API connectivity...');
    results.connectivity = await testApi('contracts');

    // Test 2: Contract Forms endpoint
    console.log('🧪 Testing Contract Forms endpoint...');
    results.contractForms = await testApi('contract_forms');

    // Test 3: Supervision Reports endpoint
    console.log('🧪 Testing Supervision endpoint...');
    results.supervision = await testApi('supervision_reports');

    // Test 4: Create a test contract form
    if (results.contractForms.success) {
      console.log('🧪 Testing form creation...');
      const testForm = {
        title: 'API Test Form',
        template_type: 'document_acquisition',
        client_name: 'Test Client',
        contractor_name: 'Test Contractor',
        project_name: 'API Test Project',
        site_location: 'Test Location',
        effective_date: '2024-01-15',
        form_data: { test: true },
        status: 'draft',
        created_by: '1',
        created_by_name: 'API Test'
      };
      
      results.createForm = await testApi('contract_forms', 'POST', testForm);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 API Connection Test</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Current Configuration:</h3>
          <p><strong>Database Type:</strong> {DATABASE_TYPE}</p>
          <p><strong>API Base URL:</strong> http://localhost/midroc-erp/backend/api</p>
        </div>

        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? '🔄 Running Tests...' : '🚀 Test API Connection'}
        </button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>
            
            {Object.entries(testResults).map(([testName, result]: [string, any]) => (
              <div key={testName} className={`p-4 rounded-lg border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{result.success ? '✅' : '❌'}</span>
                  <strong className="capitalize">{testName.replace(/([A-Z])/g, ' $1')}</strong>
                  <span className={`px-2 py-1 rounded text-sm ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {result.status}
                  </span>
                </div>
                
                {result.error && (
                  <div className="text-red-600 text-sm mb-2">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.success && result.data && (
                  <div className="text-sm text-gray-600">
                    <strong>Response:</strong>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🛠️ Troubleshooting:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Make sure XAMPP Apache and MySQL are running</li>
            <li>• Verify backend files are in: <code>xampp/htdocs/midroc-erp/backend/</code></li>
            <li>• Check API URL: <a href="http://localhost/midroc-erp/backend/api/contracts" target="_blank" className="text-blue-600 underline">http://localhost/midroc-erp/backend/api/contracts</a></li>
            <li>• Verify database 'midroc' exists in phpMyAdmin</li>
            <li>• Check browser console for CORS errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
