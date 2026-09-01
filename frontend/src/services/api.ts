const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchGraph() {
  const res = await fetch(`${API_URL}/api/supply-chain/graph`);
  if (!res.ok) throw new Error("Failed to fetch graph");
  return res.json();
}

export async function simulateDisruption(payload: any) {
  const res = await fetch(`${API_URL}/api/disruptions/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to simulate disruption");
  return res.json();
}

export async function fetchVulnerabilities() {
  const res = await fetch(`${API_URL}/api/supply-chain/vulnerabilities`);
  if (!res.ok) throw new Error("Failed to fetch vulnerabilities");
  return res.json();
}
