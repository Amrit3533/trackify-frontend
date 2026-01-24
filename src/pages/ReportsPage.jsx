import React from "react";
import API from "../api/api";
import { useEffect, useState } from "react";
import {
  ArrowBigLeft,
  ArrowBigLeftDashIcon,
  ArrowBigLeftIcon,
  ArrowBigRight,
} from "lucide-react";
const ReportsPage = ({ t, isDark }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyMeta, setMonthlyMeta] = useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const monthDate = new Date(year, month - 1, 1);

  useEffect(() => {
    API.get("/routine/reports", {
      params: {
        type: "monthly",
        month,
        year,
      },
    })
      .then((res) => {
        setMonthlyData(res.data.data || []);
        setMonthlyMeta({ month: res.data.month, year: res.data.year });
      })
      .catch(console.error);
  }, [month, year]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [weeklyData, setWeeklyData] = useState([]);

  const formatWeekRange = (start) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (d) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return `${format(start)} - ${format(end)}`;
  };

  const isFutureWeek = (weekStart) => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek > new Date();
  };

  const isFutureMonth = (monthDate) => {
    const now = new Date();

    return (
      monthDate.getFullYear() === now.getFullYear() &&
      monthDate.getMonth() === now.getMonth()
    );
  };

  const MobileReportCards = ({ data, t }) => {
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

  const formatDateYYYYMMDD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    const startDate = formatDateYYYYMMDD(weekStart);
    const endDate = formatDateYYYYMMDD(addDays(weekStart, 6));

    API.get("/routine/reports", {
      params: {
        type: "weekly",
        start: startDate,
        end: endDate,
      },
    })
      .then((res) => setWeeklyData(res.data.data || []))
      .catch(() => setWeeklyData([]));
  }, [weekStart]);

  return (
    <div style={{ display: "flex", background: t.bg }}>
      <div
        style={{
          flex: 1,
          padding: isMobile ? "20px" : "32px",
          maxWidth: "100%",
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
                display: isMobile ? "" : "flex",
                alignItems: "center",
                marginBottom: "24px",
                justifyContent: "space-between",
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
                  textAlign: isMobile ? "center" : ""
                }}
              >
                <span>📅</span> Weekly Summary
              </h2>
              <div
                style={{
                  position: "sticky",
                  top: "60px",
                  zIndex: 50,
                  background: "rgb(26, 31, 46)",
                  padding: "8px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() =>
                      setWeekStart((prev) => {
                        const d = new Date(prev);
                        d.setDate(d.getDate() - 7);
                        return d;
                      })
                    }
                    style={{
                      background: "rgb(26, 31, 46)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <ArrowBigLeft size={18} color="#fff" />
                  </button>

                  <div
                    style={{
                      padding: "6px 12px",
                      background: "rgba(160,90,255,0.1)",
                      borderRadius: "6px",
                      fontWeight: "600",
                      color: "#c1bdbd"
                    }}
                  >
                    {formatWeekRange(weekStart)}
                  </div>

                  <button
                    onClick={() =>
                      setWeekStart((prev) => {
                        const d = new Date(prev);
                        d.setDate(d.getDate() + 7);
                        return d;
                      })
                    }
                    disabled={isFutureWeek(weekStart)}
                    style={{
                      background: "rgb(26, 31, 46)",
                      border: "none",
                      opacity: isFutureWeek(weekStart) ? 0.4 : 1,
                      cursor: isFutureWeek(weekStart)
                        ? "not-allowed"
                        : "pointer",
                      pointerEvents: isFutureWeek(weekStart) ? "none" : "auto",
                    }}
                  >
                    <ArrowBigRight size={18} color="#fff" />
                  </button>
                </div>
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
                {weeklyData.length === 0 ? (
                  <div style={{ color: t.textSecondary, padding: "20px" }}>
                    No data available
                  </div>
                ) : (
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
                )}
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
                display: isMobile ? "" : "flex",
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
                  position: "sticky",
                  top: "60px",
                  zIndex: 50,
                  background: "rgb(26, 31, 46)",
                  padding: "8px 12px",
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Left */}
                  <button
                    onClick={prevMonth}
                    style={{
                      background: "rgb(26, 31, 46)",
                      border: "none",
                      cursor: "pointer",
                      justifySelf: "start",
                    }}
                  >
                    <ArrowBigLeft size={18} color="#fff" />
                  </button>

                  <div
                    style={{
                      justifySelf: "center",
                      fontWeight: "600",
                      padding: "6px 12px",
                      background: "rgba(160,90,255,0.1)",
                      borderRadius: "6px",
                      whiteSpace: "nowrap",
                      color: "#c1bdbd"
                    }}
                  >
                    {new Date(year, month - 1).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {/* Right */}
                  <button
                    onClick={nextMonth}
                    disabled={isFutureMonth(monthDate)}
                    style={{
                      background: "rgb(26, 31, 46)",
                      border: "none",
                      opacity: isFutureMonth(monthDate) ? 0.4 : 1,
                      cursor: isFutureMonth(monthDate)
                        ? "not-allowed"
                        : "pointer",
                      pointerEvents: isFutureMonth(monthDate) ? "none" : "auto",
                      justifySelf: "end",
                    }}
                  >
                    <ArrowBigRight size={18} color="#fff" />
                  </button>
                </div>
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
                {monthlyData.length === 0 ? (
                  <div style={{ color: t.textSecondary, padding: "20px" }}>
                    No data available
                  </div>
                ) : (
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
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
