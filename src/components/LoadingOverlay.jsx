// components/LoadingOverlay.jsx
const LoadingOverlay = ({ message = "Processing...", subMessage }) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(6px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000
    }}>
      <div style={{
        padding: "2rem 3rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        
        {/* AI Icon */}
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>

        {/* Main Message */}
        <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#1f2937" }}>
          {message}
        </h3>

        {/* Sub Message */}
        {subMessage && (
          <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>{subMessage}</p>
        )}

        {/* Loading animation */}
        <div className="loader" style={{
          marginTop: "1rem",
          width: "40px",
          height: "40px",
          border: "4px solid #93c5fd",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginLeft: "auto",
          marginRight: "auto"
        }}></div>

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LoadingOverlay;
