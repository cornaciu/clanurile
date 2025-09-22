'use client';

import { useEffect, useState } from 'react';

type RouteMeta = { method: string; url: string; summary?: string; group?: string; requiresAuth?: boolean; };

export default function AdminDashboard() {
  const [routes, setRoutes] = useState<RouteMeta[]>([]);
  const [log, setLog] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:4000/api/discovery')
      .then(r => r.json())
      .then(data => setRoutes(data.routes || []))
      .catch(e => setLog('Eroare la discovery: ' + (e as Error).message));
  }, []);

  async function callRoute(route: RouteMeta) {
    setLog(`Calling ${route.method} ${route.url} ...`);
    try {
      const options: RequestInit = { method: route.method };
      if (route.method === 'POST') {
        options.headers = { 'Content-Type': 'application/json', 'x-user-id': 'admin-dev' };
        options.body = JSON.stringify({ actionType: 'test', params: {} });
      }
      const res = await fetch(`http://localhost:4000${route.url}`, options);
      const text = await res.text();
      setLog(`Response ${res.status}: ${text}`);
    } catch (err: any) {
      setLog('Error: ' + err.message);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin API Dashboard</h1>
      <div className="mb-4">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">Method</th>
              <th className="p-2">URL</th>
              <th className="p-2">Group</th>
              <th className="p-2">Summary</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.method}</td>
                <td className="p-2">{r.url}</td>
                <td className="p-2">{r.group}</td>
                <td className="p-2">{r.summary}</td>
                <td className="p-2">
                  <button
                    onClick={() => callRoute(r)}
                    className="px-3 py-1 rounded border hover:bg-gray-100"
                  >
                    Test
                  </button>
                </td>
              </tr>
            ))}
            {routes.length === 0 && <tr><td colSpan={5} className="p-4 text-gray-500">No routes found</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold">Log</h2>
        <pre className="bg-gray-900 text-white p-3 rounded max-h-64 overflow-auto">{log}</pre>
      </div>
    </div>
  );
}
