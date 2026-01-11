const Footer = ({ t , isMobile}) => (
  <footer
    style={{
      background: t.cardBg,
      borderTop: `1px solid ${t.border}`,
      padding: isMobile ? "16px" : "32px",
      // marginTop: "auto",
    }}
  >
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <a
          href="mailto:amritsinghofficial3533@gmail.com"
          style={{
            color: t.textSecondary,
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = t.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = t.textSecondary)}
        >
          📧 Email
        </a>

        <span style={{ color: t.border }}>•</span>

        <a
          href="https://github.com/your-username"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: t.textSecondary,
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = t.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = t.textSecondary)}
        >
          💻 GitHub
        </a>

        <span style={{ color: t.border }}>•</span>

        <a
          href="https://linkedin.com/in/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: t.textSecondary,
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = t.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = t.textSecondary)}
        >
          🌐 LinkedIn
        </a>
      </div>

      <div
        style={{
          fontSize: "13px",
          color: t.textSecondary,
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Trackify. Made with ❤️ for productivity
        enthusiasts.
      </div>
    </div>
  </footer>
);

export default Footer;
