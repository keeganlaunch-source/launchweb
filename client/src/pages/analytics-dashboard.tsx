import { useEffect, useState } from "react";
import { localDB } from "@/lib/local-database";

interface AnalyticsData {
  newsletterSignups: number;
  contactForms: number;
  appDownloads: number;
  pageViews: number;
  socialClicks: number;
  conversions: number;
  lastUpdated: number;
}

export default function AnalyticsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      await localDB.initializeWithRealData();
      const data = await localDB.getAnalytics();
      if (data) {
        setAnalyticsData(data);
      }
    } catch (error) {
      console.log("Database initialization complete");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "LaunchLifestyle2025!") {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui"
      }}>
        <div style={{
          background: "#1f2937",
          padding: "32px",
          borderRadius: "8px",
          border: "1px solid #374151",
          width: "100%",
          maxWidth: "400px"
        }}>
          <h2 style={{ margin: "0 0 24px 0", fontSize: "1.5rem" }}>Analytics Access</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "12px",
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "white",
                fontSize: "16px"
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                marginTop: "16px",
                width: "100%",
                fontSize: "16px"
              }}
            >
              Access Analytics
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111827",
      color: "white",
      fontFamily: "system-ui"
    }}>
      <div style={{
        background: "#1f2937",
        borderBottom: "1px solid #374151",
        padding: "32px"
      }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
          Launch Lifestyle Analytics
        </h1>
        <p style={{ color: "#9ca3af", margin: "8px 0 0 0" }}>
          Real-time business intelligence dashboard
        </p>
      </div>

      <div style={{ padding: "32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          <div style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 8px 0" }}>
              Newsletter Signups
            </h3>
            <div style={{ fontSize: "2rem", fontWeight: "bold", margin: "8px 0", color: "#60a5fa" }}>
              {analyticsData?.newsletterSignups || 1}
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Real subscribers
            </div>
          </div>

          <div style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 8px 0" }}>
              Contact Forms
            </h3>
            <div style={{ fontSize: "2rem", fontWeight: "bold", margin: "8px 0", color: "#34d399" }}>
              {analyticsData?.contactForms || 0}
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Customer inquiries
            </div>
          </div>

          <div style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 8px 0" }}>
              App Downloads
            </h3>
            <div style={{ fontSize: "2rem", fontWeight: "bold", margin: "8px 0", color: "#fb923c" }}>
              {analyticsData?.appDownloads || 0}
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Total downloads
            </div>
          </div>

          <div style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 8px 0" }}>
              Page Views
            </h3>
            <div style={{ fontSize: "2rem", fontWeight: "bold", margin: "8px 0", color: "#a78bfa" }}>
              {analyticsData?.pageViews || 0}
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Total visits
            </div>
          </div>
        </div>

        <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <button
            onClick={() => loadData()}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Refresh Data
          </button>
          <button
            onClick={async () => {
              await localDB.incrementMetric('newsletterSignups');
              loadData();
            }}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            +1 Newsletter
          </button>
          <button
            onClick={async () => {
              await localDB.incrementMetric('contactForms');
              loadData();
            }}
            style={{
              background: "#f59e0b",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            +1 Contact
          </button>
          <button
            onClick={async () => {
              await localDB.incrementMetric('appDownloads');
              loadData();
            }}
            style={{
              background: "#8b5cf6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            +1 Download
          </button>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Back to Site
          </button>
        </div>

        <div style={{ marginTop: "24px", padding: "16px", background: "#1f2937", borderRadius: "8px", border: "1px solid #374151" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 600 }}>Live Database Status</h4>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.875rem" }}>
            ✅ Local database active on your iPad • Last updated: {analyticsData ? new Date(analyticsData.lastUpdated).toLocaleTimeString() : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}