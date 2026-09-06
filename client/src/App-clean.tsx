export default function App() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "white",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: "black",
        color: "white",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: "#FAFF00",
            color: "black",
            padding: "4px 8px",
            fontWeight: "bold",
            fontSize: "18px"
          }}>
            LAUNCH
          </div>
        </div>
        
        <nav style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <span>FEATURES</span>
          <span>STORIES</span>
          <span>PRICING</span>
          <span>LAUNCH AI</span>
          <span>CONTACT</span>
          <button style={{
            background: "#FAFF00",
            color: "black",
            border: "none",
            padding: "10px 20px",
            fontWeight: "bold",
            borderRadius: "4px"
          }}>
            START NOW
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ padding: "60px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "60px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Left Side */}
          <div style={{ flex: "1" }}>
            <h1 style={{ 
              fontSize: "4rem", 
              fontWeight: "900", 
              color: "black", 
              margin: "0 0 20px 0",
              lineHeight: "1.1"
            }}>
              OWN YOUR <span style={{ background: "#FAFF00", padding: "0 10px" }}>FITNESS</span><br />
              JOURNEY, ANYWHERE
            </h1>
            
            <p style={{ 
              fontSize: "1.2rem", 
              color: "#666", 
              marginBottom: "30px",
              lineHeight: "1.5"
            }}>
              Transform your body and mind with personalized workouts that adapt to your lifestyle, schedule, and goals.
            </p>

            {/* Features */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div style={{ width: "20px", height: "20px", background: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✓</div>
                <span>No gym membership required</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div style={{ width: "20px", height: "20px", background: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✓</div>
                <span>Personalized workout plans</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div style={{ width: "20px", height: "20px", background: "black", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✓</div>
                <span>24/7 expert guidance</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <button style={{
                background: "#FAFF00",
                color: "black",
                border: "none",
                padding: "15px 30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                🚀 START FREE TRIAL - JOIN 1000+ MEMBERS
              </button>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button style={{
                background: "black",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                TRY LAUNCH AI
              </button>
              <button style={{
                background: "transparent",
                color: "black",
                border: "2px solid black",
                padding: "12px 24px",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                GET FREE GUIDE
              </button>
            </div>

            <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#666" }}>
              ✓ No Credit Card Required &nbsp;&nbsp; ✓ Cancel Anytime &nbsp;&nbsp; ✓ 30-Day Guarantee
            </div>
          </div>

          {/* Right Side - Image */}
          <div style={{ flex: "1", position: "relative" }}>
            <div style={{
              background: "#f0f0f0",
              height: "400px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#666"
            }}>
              Fitness Image Placeholder
            </div>
            
            <div style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "#FAFF00",
              color: "black",
              padding: "15px 20px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              JOIN OUR<br />ACTIVE MEMBERS
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Widget */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#25D366",
        color: "white",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: "1000"
      }}>
        💬
      </div>

      {/* Launch AI Widget */}
      <div style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        background: "black",
        color: "white",
        padding: "10px 15px",
        borderRadius: "25px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        zIndex: "1000"
      }}>
        LAUNCH AI
      </div>
    </div>
  );
}