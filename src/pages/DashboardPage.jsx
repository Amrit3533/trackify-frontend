import React from "react";
import { TrendingUp, Award, Target, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "../api/api";

const DashboardPage = ({ t, isDark }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredInsight, setHoveredInsight] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const res = await getDashboardData();
        if (mounted) {
          setDashboard(res.data);
          setError(false);
        }
      } catch (err) {
        console.error("Dashboard API error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    return () => (mounted = false);
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  if (loading) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
        Failed to load dashboard
      </div>
    );
  }

  const weeklyData = dashboard.weeklyConsistency || [];
  const completionData = dashboard.completionTrend || [];

  const toLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const maxTotal = Math.max(...completionData.map((d) => d.total), 1);
  const scaleY = 140 / maxTotal; // 140px usable height

  return (
    <div style={{ display: "flex", background: t.bg }}>
      <div
        style={{
          flex: 1,
          padding: isMobile ? "20px" : "32px",
          maxWidth: "100%",
          // overflow: "auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "600",
              color: t.text,
              marginBottom: "8px",
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>
            Overview of your habits and progress
          </p>
        </div>
        <div
          style={{
            padding: isMobile ? "4px" : "0",
          }}
        >
          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            {/* Overall Consistency */}
            <div
              onMouseEnter={() => setHoveredStat(0)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                background: t.cardBg,
                border: `1px solid ${hoveredStat === 0 ? t.primary : t.border}`,
                borderRadius: "16px",
                padding: isMobile ? "20px" : "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform:
                  hoveredStat === 0 ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredStat === 0
                    ? isDark
                      ? "0 20px 40px rgba(160,90,255,0.3)"
                      : "0 20px 40px rgba(160,90,255,0.2)"
                    : isDark
                      ? "0 4px 16px rgba(0,0,0,0.2)"
                      : "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "140px",
                  height: "140px",
                  background:
                    "linear-gradient(135deg, rgba(160,90,255,0.15), rgba(160,90,255,0.05))",
                  borderRadius: "50%",
                  transform:
                    hoveredStat === 0
                      ? "translate(30%, -30%) scale(1.2)"
                      : "translate(40%, -40%)",
                  transition: "all 0.4s ease",
                }}
              />
              <div
                style={{
                  fontSize: isMobile ? "36px" : "42px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: t.textSecondary,
                  marginBottom: "12px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Overall Consistency
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: isMobile ? "34px" : "42px",
                    fontWeight: "700",
                    color: t.text,
                  }}
                >
                  <span>{dashboard.overallConsistency}%</span>
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: t.success,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {dashboard.weekChange && (
                    <>
                      <TrendingUp size={16} /> {dashboard.weekChange}%
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Active Streak */}
            <div
              onMouseEnter={() => setHoveredStat(1)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                background: t.cardBg,
                border: `1px solid ${hoveredStat === 1 ? "#FE9496" : t.border}`,
                borderRadius: "16px",
                padding: isMobile ? "20px" : "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform:
                  hoveredStat === 1 ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredStat === 1
                    ? isDark
                      ? "0 20px 40px rgba(254,148,150,0.3)"
                      : "0 20px 40px rgba(254,148,150,0.2)"
                    : isDark
                      ? "0 4px 16px rgba(0,0,0,0.2)"
                      : "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "140px",
                  height: "140px",
                  background:
                    "linear-gradient(135deg, rgba(254,148,150,0.15), rgba(254,148,150,0.05))",
                  borderRadius: "50%",
                  transform:
                    hoveredStat === 1
                      ? "translate(30%, -30%) scale(1.2)"
                      : "translate(40%, -40%)",
                  transition: "all 0.4s ease",
                }}
              />
              <div
                style={{
                  fontSize: isMobile ? "36px" : "42px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                🔥
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: t.textSecondary,
                  marginBottom: "12px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Active Streak
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: isMobile ? "34px" : "42px",
                    fontWeight: "700",
                    color: t.text,
                  }}
                >
                  <span>{dashboard.currentStreak}</span>
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: t.textSecondary,
                    fontWeight: "600",
                  }}
                >
                  days
                </span>
              </div>
            </div>

            {/* Best Performing Day */}
            <div
              onMouseEnter={() => setHoveredStat(2)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                background: t.cardBg,
                border: `1px solid ${hoveredStat === 2 ? "#1BCFB4" : t.border}`,
                borderRadius: "16px",
                padding: isMobile ? "20px" : "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform:
                  hoveredStat === 2 ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredStat === 2
                    ? isDark
                      ? "0 20px 40px rgba(27,207,180,0.3)"
                      : "0 20px 40px rgba(27,207,180,0.2)"
                    : isDark
                      ? "0 4px 16px rgba(0,0,0,0.2)"
                      : "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "140px",
                  height: "140px",
                  background:
                    "linear-gradient(135deg, rgba(27,207,180,0.15), rgba(27,207,180,0.05))",
                  borderRadius: "50%",
                  transform:
                    hoveredStat === 2
                      ? "translate(30%, -30%) scale(1.2)"
                      : "translate(40%, -40%)",
                  transition: "all 0.4s ease",
                }}
              />
              <div
                style={{
                  fontSize: isMobile ? "36px" : "42px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                ⭐
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: t.textSecondary,
                  marginBottom: "12px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Best Performing Day
              </h3>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: t.text,
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <div>
                      {dashboard.bestDay
                        ? toLocalDate(
                            dashboard.bestDay.date,
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                          })
                        : "-"}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "14px", color: t.textSecondary }}>
                  {dashboard.bestDay?.percent}% completion
                </span>
              </div>
            </div>

            {/* Weakest Day */}
            <div
              onMouseEnter={() => setHoveredStat(3)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                background: t.cardBg,
                border: `1px solid ${hoveredStat === 3 ? t.warning : t.border}`,
                borderRadius: "16px",
                padding: isMobile ? "20px" : "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform:
                  hoveredStat === 3 ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredStat === 3
                    ? isDark
                      ? "0 20px 40px rgba(245,158,11,0.3)"
                      : "0 20px 40px rgba(245,158,11,0.2)"
                    : isDark
                      ? "0 4px 16px rgba(0,0,0,0.2)"
                      : "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "140px",
                  height: "140px",
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                  borderRadius: "50%",
                  transform:
                    hoveredStat === 3
                      ? "translate(30%, -30%) scale(1.2)"
                      : "translate(40%, -40%)",
                  transition: "all 0.4s ease",
                }}
              />
              <div
                style={{
                  fontSize: isMobile ? "36px" : "42px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                ⚠️
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: t.textSecondary,
                  marginBottom: "12px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Weakest Day
              </h3>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: t.text,
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <div>
                      {dashboard.worstDay
                        ? toLocalDate(
                            dashboard.worstDay.date,
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                          })
                        : "-"}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "14px", color: t.textSecondary }}>
                  {dashboard.worstDay?.percent}% completion
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ padding: isMobile ? "4px" : "0" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "24px",
                marginBottom: "32px",
              }}
            >
              {/* Weekly Consistency Trend */}
              <div
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: t.text,
                        marginBottom: "4px",
                      }}
                    >
                      Weekly Consistency Trend
                    </h3>
                    <p style={{ fontSize: "13px", color: t.textSecondary }}>
                      Your daily completion rate
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      background: isDark
                        ? "rgba(160,90,255,0.1)"
                        : "rgba(160,90,255,0.08)",
                      borderRadius: "6px",
                      color: t.primary,
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    This Week
                  </div>
                </div>

                {/* Line Chart */}
                <div
                  style={{
                    position: "relative",
                    height: isMobile ? "200px" : "220px",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  {weeklyData.length > 0 && (
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 560 220"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <linearGradient
                          id="lineGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor={t.primary}
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor={t.primary}
                            stopOpacity="0.05"
                          />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map((val, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1={170 - val * 1.4}
                          x2="530"
                          y2={170 - val * 1.4}
                          stroke={t.border}
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                      ))}

                      {/* Area under line */}
                      <path
                        d={`M 50 ${
                          170 - weeklyData[0].consistency * 1.4
                        } ${weeklyData
                          .map(
                            (d, i) =>
                              `L ${50 + i * 80} ${170 - d.consistency * 1.4}`,
                          )
                          .join(" ")} L ${
                          50 + (weeklyData.length - 1) * 80
                        } 170 L 50 170 Z`}
                        fill="url(#lineGradient)"
                      />

                      {/* Line */}
                      <path
                        d={`M 50 ${
                          170 - weeklyData[0].consistency * 1.4
                        } ${weeklyData
                          .map(
                            (d, i) =>
                              `L ${50 + i * 80} ${170 - d.consistency * 1.4}`,
                          )
                          .join(" ")}`}
                        fill="none"
                        stroke={t.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {weeklyData.map((d, i) => (
                        <circle
                          key={i}
                          cx={50 + i * 80}
                          cy={170 - d.consistency * 1.4}
                          r="5"
                          fill={t.cardBg}
                          stroke={t.primary}
                          strokeWidth="3"
                        />
                      ))}

                      {/* X-axis labels */}
                      {weeklyData.map((d, i) => (
                        <text
                          key={d.date}
                          x={50 + i * 80}
                          y="200"
                          textAnchor="middle"
                          fill={t.textSecondary}
                          fontSize={isMobile ? "10" : "12"}
                          fontWeight="500"
                        >
                          {toLocalDate(d.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </text>
                      ))}
                    </svg>
                  )}
                </div>
              </div>

              {/* Routine Completion Over Time */}
              <div
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: t.text,
                        marginBottom: "4px",
                      }}
                    >
                      Routine Completion
                    </h3>
                    <p style={{ fontSize: "13px", color: t.textSecondary }}>
                      Completed vs total habits
                    </p>
                  </div>
                  <BarChart3 size={20} color={t.primary} />
                </div>

                {/* Bar Chart */}
                <div
                  style={{
                    position: "relative",
                    height: isMobile ? "200px" : "220px",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  {weeklyData.length > 0 && (
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 560 220"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Grid lines */}
                      {[0, 2.5, 5, 7.5, 10].map((val, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1={170 - val * 14}
                          x2="530"
                          y2={170 - val * 14}
                          stroke={t.border}
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                      ))}

                      {/* Bars */}
                      {completionData.map((d, i) => {
                        const barWidth = 55;
                        const spacing = 70;
                        const xPos = 60 + i * spacing;

                        return (
                          <g key={i}>
                            {/* Background bar (total) */}
                            <rect
                              x={xPos}
                              y={170 - d.total * scaleY}
                              width={barWidth}
                              height={d.total * scaleY}
                              fill={
                                isDark
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.05)"
                              }
                              rx="6"
                            />
                            {/* Completion bar */}
                            <rect
                              x={xPos}
                              y={170 - d.completed * scaleY}
                              width={barWidth}
                              height={d.completed * scaleY}
                              fill={t.gradient2}
                              rx="6"
                            />
                          </g>
                        );
                      })}

                      {/* X-axis labels */}
                      {completionData.map((d, i) => (
                        <text
                          key={i}
                          x={87.5 + i * 70}
                          y="200"
                          textAnchor="middle"
                          fill={t.textSecondary}
                          fontSize={isMobile ? "10" : "12"}
                          fontWeight="500"
                        >
                          {toLocalDate(d.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </text>
                      ))}
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "20px",
              }}
            >
              Insights & Recommendations
            </h2>

            <div style={{ padding: isMobile ? "4px" : "0" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {/* Insight 1 */}
                <div
                  onMouseEnter={() => setHoveredInsight(0)}
                  onMouseLeave={() => setHoveredInsight(null)}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${
                      hoveredInsight === 0 ? t.success : t.border
                    }`,
                    borderRadius: "12px",
                    padding: isMobile ? "16px" : "20px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform:
                      hoveredInsight === 0
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredInsight === 0
                        ? isDark
                          ? "0 12px 24px rgba(16,185,129,0.2)"
                          : "0 12px 24px rgba(16,185,129,0.15)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "36px" : "40px",
                        height: isMobile ? "36px" : "40px",

                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <TrendingUp size={20} color={t.success} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: isMobile ? "14px" : "15px",
                          fontWeight: "600",
                          color: t.text,
                          marginBottom: "6px",
                        }}
                      >
                        Great Progress!
                      </h4>
                      <p
                        style={{
                          fontSize: isMobile ? "12px" : "13px",
                          color: t.textSecondary,
                          lineHeight: "1.5",
                        }}
                      >
                        Consistency improved by +12% this week. Keep up the
                        momentum!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Insight 2 */}
                <div
                  onMouseEnter={() => setHoveredInsight(1)}
                  onMouseLeave={() => setHoveredInsight(null)}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${
                      hoveredInsight === 1 ? t.info : t.border
                    }`,
                    borderRadius: "12px",
                    padding: isMobile ? "16px" : "20px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform:
                      hoveredInsight === 1
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredInsight === 1
                        ? isDark
                          ? "0 12px 24px rgba(59,130,246,0.2)"
                          : "0 12px 24px rgba(59,130,246,0.15)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "36px" : "40px",
                        height: isMobile ? "36px" : "40px",

                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Award size={20} color={t.info} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: isMobile ? "14px" : "15px",
                          fontWeight: "600",
                          color: t.text,
                          marginBottom: "6px",
                        }}
                      >
                        Friday Champion
                      </h4>
                      <p
                        style={{
                          fontSize: isMobile ? "12px" : "13px",
                          color: t.textSecondary,
                          lineHeight: "1.5",
                        }}
                      >
                        Friday shows highest engagement with 95% completion
                        rate.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Insight 3 */}
                <div
                  onMouseEnter={() => setHoveredInsight(2)}
                  onMouseLeave={() => setHoveredInsight(null)}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${
                      hoveredInsight === 2 ? t.warning : t.border
                    }`,
                    borderRadius: "12px",
                    padding: isMobile ? "16px" : "20px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform:
                      hoveredInsight === 2
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredInsight === 2
                        ? isDark
                          ? "0 12px 24px rgba(245,158,11,0.2)"
                          : "0 12px 24px rgba(245,158,11,0.15)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "36px" : "40px",
                        height: isMobile ? "36px" : "40px",

                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Target size={20} color={t.warning} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: isMobile ? "14px" : "15px",
                          fontWeight: "600",
                          color: t.text,
                          marginBottom: "6px",
                        }}
                      >
                        Evening Challenge
                      </h4>
                      <p
                        style={{
                          fontSize: isMobile ? "12px" : "13px",
                          color: t.textSecondary,
                          lineHeight: "1.5",
                        }}
                      >
                        Evenings underperform consistently. Try scheduling key
                        habits earlier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
