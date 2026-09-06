import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function SimpleHome() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "3rem", margin: "0", fontWeight: "bold" }}>
          LAUNCH LIFESTYLE
        </h1>
        <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
          Transform Your Fitness Journey
        </p>
      </header>
      
      <main style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
            Premium Fitness Coaching
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Join 1000+ members transforming their lives with personalized workouts, 
            nutrition guidance, and AI-powered coaching support.
          </p>
        </section>
        
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          padding: "30px", 
          borderRadius: "15px",
          margin: "30px 0"
        }}>
          <h3 style={{ marginBottom: "15px" }}>Start Your Transformation</h3>
          <p>Custom workouts • Nutrition plans • 24/7 support</p>
          <button style={{
            background: "#FAFF00",
            color: "#000",
            border: "none",
            padding: "15px 30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "25px",
            marginTop: "20px",
            cursor: "pointer"
          }}>
            START FREE TRIAL
          </button>
        </div>
        
        <footer style={{ marginTop: "60px", fontSize: "0.9rem", opacity: "0.8" }}>
          <p>Contact: keegan.launch@gmail.com | WhatsApp: Available</p>
        </footer>
      </main>
      
      {/* Contact widgets will be added back */}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleHome />
    </QueryClientProvider>
  );
}