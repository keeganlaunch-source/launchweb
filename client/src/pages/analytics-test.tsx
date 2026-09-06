export default function AnalyticsTest() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Analytics Dashboard Test</h1>
      <p>This is a test to verify routing is working.</p>
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #333' }}>
        <h2>Password Required</h2>
        <input type="password" placeholder="Enter password" style={{ padding: '10px', margin: '10px' }} />
        <button style={{ padding: '10px 20px', marginLeft: '10px' }}>Access</button>
      </div>
    </div>
  );
}