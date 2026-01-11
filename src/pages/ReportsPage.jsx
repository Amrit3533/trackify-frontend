import React from "react";
import API from "../api/api";
import { useEffect, useState } from "react";
const ReportsPage = ({ t, isDark }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyMeta, setMonthlyMeta] = useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    API.get("/routine/reports?type=weekly")
      .then((res) => {
        setWeeklyData(res.data.data || []);
      })
      .catch(console.error);

    API.get("/routine/reports?type=monthly")
      .then((res) => {
        setMonthlyData(res.data.data);
        setMonthlyMeta({
          month: res.data.month,
          year: res.data.year,
        });
      })
      .catch(console.error);
  }, []);

  const getWeekRangeLabel = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sun
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(today);
    start.setDate(today.getDate() + diffToMonday);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (d) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    return `${format(start)} - ${format(end)}`;
  };

  const MobileReportCards = ({ data, t, title }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ color: t.textSecondary, fontSize: "14px" }}>
          No data available
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((item) => (
          <div
            key={item.habit}
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {/* Habit name */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "8px",
              }}
            >
              {item.habit}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: t.textSecondary,
                marginBottom: "10px",
              }}
            >
              <span>
                Completed:{" "}
                <strong style={{ color: t.text }}>{item.completed}</strong>
              </span>
              <span>
                Total: <strong style={{ color: t.text }}>{item.total}</strong>
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: "8px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${item.percentage}%`,
                  height: "100%",
                  background:
                    item.percentage >= 80
                      ? t.success
                      : item.percentage >= 60
                      ? t.warning
                      : t.danger,
                }}
              />
            </div>

            {/* Percentage */}
            <div
              style={{
                marginTop: "6px",
                fontSize: "13px",
                fontWeight: "600",
                color:
                  item.percentage >= 80
                    ? t.success
                    : item.percentage >= 60
                    ? t.warning
                    : t.danger,
                textAlign: "right",
              }}
            >
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: "600",
                color: t.text,
                marginBottom: "8px",
              }}
            >
              Reports
            </h1>
            <p style={{ fontSize: "14px", color: t.textSecondary }}>
              Detailed insights into your habit performance
            </p>
          </div>

          {/* Weekly Summary */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: "16px",
              padding: isMobile ? "20px" : "32px",
              marginBottom: "24px",
              overflow: "hidden",
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
              <h2
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "600",
                  color: t.text,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📊</span> Weekly Summary
              </h2>
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
                {getWeekRangeLabel()}
              </div>
            </div>
            {/* Weekly Table */}
            {isMobile ? (
              <MobileReportCards data={weeklyData} t={t} />
            ) : (
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: "900px",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "left",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Habit
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "center",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                        }}
                      >
                        Completed
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "center",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "left",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                          minWidth: "200px",
                        }}
                      >
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyData.map((item) => (
                      <tr key={item.habit}>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            borderBottom: `1px solid ${t.border}`,
                            fontSize: "14px",
                            fontWeight: "500",
                            color: t.text,
                          }}
                        >
                          {item.habit}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            textAlign: "center",
                            borderBottom: `1px solid ${t.border}`,
                            fontSize: "14px",
                            fontWeight: "600",
                            color: t.success,
                          }}
                        >
                          {item.completed}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            textAlign: "center",
                            borderBottom: `1px solid ${t.border}`,
                            fontSize: "14px",
                            color: t.textSecondary,
                          }}
                        >
                          {item.total}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            borderBottom: `1px solid ${t.border}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: "8px",
                                minWidth: "120px",
                                background: isDark
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.05)",
                                borderRadius: "4px",
                              }}
                            >
                              <div
                                style={{
                                  width: `${item.percentage}%`,
                                  height: "100%",
                                  background:
                                    item.percentage >= 80
                                      ? t.success
                                      : item.percentage >= 60
                                      ? t.warning
                                      : t.danger,
                                  borderRadius: "4px",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color:
                                  item.percentage >= 80
                                    ? t.success
                                    : item.percentage >= 60
                                    ? t.warning
                                    : t.danger,
                                minWidth: "45px",
                              }}
                            >
                              {item.percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Monthly Summary */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: "16px",
              padding: isMobile ? "20px" : "32px",
              overflow: "hidden",
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
              <h2
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "600",
                  color: t.text,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📅</span> Monthly Summary
              </h2>
              <div
                style={{
                  padding: "6px 12px",
                  background: isDark
                    ? "rgba(27,207,180,0.1)"
                    : "rgba(27,207,180,0.08)",
                  borderRadius: "6px",
                  color: "#1BCFB4",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {monthlyMeta
                  ? new Date(
                      monthlyMeta.year,
                      monthlyMeta.month - 1
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </div>
            </div>
            {/* Monthly Table */}
            {isMobile ? (
              <MobileReportCards data={monthlyData} t={t} />
            ) : (
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: "900px",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "left",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Habit
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "center",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                        }}
                      >
                        Completed
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "center",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "10px 12px" : "12px 16px",
                          textAlign: "left",
                          borderBottom: `2px solid ${t.border}`,
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.textSecondary,
                          minWidth: "200px",
                        }}
                      >
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((item, idx) => (
                      <tr key={item.habit}>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            borderBottom:
                              idx < monthlyData.length - 1
                                ? `1px solid ${t.border}`
                                : "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: t.text,
                          }}
                        >
                          {item.habit}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            textAlign: "center",
                            borderBottom:
                              idx < monthlyData.length - 1
                                ? `1px solid ${t.border}`
                                : "none",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: t.success,
                          }}
                        >
                          {item.completed}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "12px" : "16px",
                            textAlign: "center",
                            borderBottom:
                              idx < monthlyData.length - 1
                                ? `1px solid ${t.border}`
                                : "none",
                            fontSize: "14px",
                            color: t.textSecondary,
                          }}
                        >
                          {item.total}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            borderBottom:
                              idx < monthlyData.length - 1
                                ? `1px solid ${t.border}`
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: "8px",
                                minWidth: "120px",
                                background: isDark
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.05)",
                                borderRadius: "4px",
                              }}
                            >
                              <div
                                style={{
                                  width: `${item.percentage}%`,
                                  height: "100%",
                                  background:
                                    item.percentage >= 80
                                      ? t.success
                                      : item.percentage >= 60
                                      ? t.warning
                                      : t.danger,
                                  borderRadius: "4px",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color:
                                  item.percentage >= 80
                                    ? t.success
                                    : item.percentage >= 60
                                    ? t.warning
                                    : t.danger,
                                minWidth: "45px",
                              }}
                            >
                              {item.percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
