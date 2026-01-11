import React, { useCallback, useEffect, useState } from "react";
import API from "../api/api"; // or your API client import path

const ExecutionHubPage = ({ t, setToastMessage, setShowToast, isDark }) => {
  const [template, setTemplate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executions, setExecutions] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const formatDateLocal = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Get today's date for this component
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Generate week dates for this component
  const getWeekDates = () => {
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const weekDates = getWeekDates();
  const start = formatDateLocal(weekDates[0]);
  const end = formatDateLocal(weekDates[6]);

  useEffect(() => {
    const fetchWeek = async () => {
      const res = await API.get(
        `/routine/week?startDate=${start}&endDate=${end}`
      );

      const map = {};
      res.data.forEach((day) => {
        Object.entries(day.values || {}).forEach(([habitId, value]) => {
          map[`${habitId}-${day.date}`] = value;
        });
      });
      setLoading(false);
      setExecutions(map);
    };

    fetchWeek();
  }, [start, end]);

  // Routine items for this component
  const routineItems = template.filter((h) => h.active);

  // Toast functions
  const showToastMessage = useCallback(
    (message) => {
      setToastMessage(message);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    },
    [setShowToast, setToastMessage]
  );

  const handleMarkAll = async (dateStr) => {
    const ids = routineItems.map((h) => h.id);

    await API.post("/routine/mark-all", {
      date: dateStr,
      habitIds: ids,
    });
    showToastMessage("Marked All");
    const updated = {};
    ids.forEach((id) => (updated[`${id}-${dateStr}`] = true));
    setExecutions((prev) => ({ ...prev, ...updated }));
  };

  const handleResetAll = async (dateStr) => {
    const ids = routineItems.map((h) => h.id);

    await API.post("/routine/reset-all", {
      date: dateStr,
      habitIds: ids,
    });

    showToastMessage("Reset All");

    const updated = {};
    ids.forEach((id) => {
      updated[`${id}-${dateStr}`] = false;
    });

    setExecutions((prev) => ({ ...prev, ...updated }));
  };

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await API.get("/routine/template");
        setTemplate(res.data?.columns || []);
      } catch (err) {
        console.error("Failed to load template", err);
        showToastMessage("Failed to load template");
        setTemplate([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [showToastMessage]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDayName = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") {
      return null; // safely ignore invalid dates
    }

    const [year, month, day] = dateStr.split("-").map(Number);

    if (!year || !month || !day) return null;

    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("en-US", { weekday: "long" });
  };

  const isToday = (date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  };

  const isPast = (date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isFuture = (date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  };

  const debounceTimers = React.useRef({});
  const toggleHabit = (habitId, dateStr) => {
    const key = `${habitId}-${dateStr}`;
    const newVal = !executions[key];

    // optimistic UI update
    setExecutions((prev) => ({ ...prev, [key]: newVal }));

    // clear previous debounce if exists
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }

    // debounce API call
    debounceTimers.current[key] = setTimeout(async () => {
      try {
        await API.post("/routine/mark", {
          habitId,
          date: dateStr,
          completed: newVal,
        });
      } catch (err) {
        console.error("Failed to update habit", err);
        showToastMessage("Failed to update habit");
      }
    }, 400); // 300–500ms is ideal
  };

  if (loading) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
        Loading execution hub...
      </div>
    );
  }

  return (
    <div
      style={{
        background: t.bg,
        padding: isMobile ? "20px" : "32px",
        flex: 1,
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: isMobile ? "24px" : "32px",
            fontWeight: "600",
            color: t.text,
            marginBottom: "8px",
          }}
        >
          Execution Hub
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: t.textSecondary,
            marginBottom: "16px",
          }}
        >
          Track your daily habits and build consistency
        </p>

        {/* Date Info Card */}
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: "12px",
            padding: isMobile ? "16px" : "20px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "16px",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: t.gradient1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              📅
            </div>
            <div>
              <div
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: t.text,
                  marginBottom: "4px",
                }}
              >
                {formatFullDate(today)}
              </div>
              <div style={{ fontSize: "14px", color: t.textSecondary }}>
                Week: {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Habits Table */}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: "16px",
        }}
      >
        {/* Mobile View */}
        {isMobile ? (
          <div
            style={{
              // padding: "16px",
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              maxWidth: "100%",
              bordeRadius: "16px",
            }}
          >
            {weekDates.map((date, dateIdx) => {
              const dateStr = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

              const todayCheck = isToday(date);
              const pastCheck = isPast(date);
              const futureCheck = isFuture(date);

              return (
                <div
                  key={dateIdx}
                  style={{
                    marginBottom: "24px",
                    paddingBottom: "24px",
                    borderBottom:
                      dateIdx < weekDates.length - 1
                        ? `1px solid ${t.border}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      padding: "14px",
                      overflow: "hidden",
                      background: todayCheck
                        ? isDark
                          ? "rgba(160,90,255,0.12)"
                          : "rgba(160,90,255,0.08)"
                        : isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                      borderRadius: "10px",
                      border: todayCheck
                        ? `2px solid ${t.primary}`
                        : `1px solid ${t.border}`,
                    }}
                  >
                    {/* Date  */}
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: todayCheck
                            ? t.primary
                            : pastCheck
                            ? t.textSecondary
                            : t.text,
                        }}
                      >
                        {getDayName(date)}
                      </div>
                      <div style={{ fontSize: "13px", color: t.textSecondary }}>
                        {formatDate(date)}
                      </div>
                    </div>

                    {/* Actions  */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* Buttons  */}
                      <button
                        onClick={() => handleMarkAll(dateStr)}
                        disabled={futureCheck}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          background: futureCheck ? t.border : t.success,
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: futureCheck ? "not-allowed" : "pointer",
                          opacity: futureCheck ? 0.5 : 1,
                          marginBottom: "2px",
                        }}
                      >
                        ✓ All
                      </button>
                      <button
                        onClick={() => handleResetAll(dateStr)}
                        disabled={futureCheck}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          background: futureCheck ? t.border : t.danger,
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {routineItems.map((item) => {
                    const key = `${item.id}-${dateStr}`;
                    const checked = executions[key] || false;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "14px",
                          borderRadius: "10px",
                          // background: isDark
                          //   ? "rgba(255,255,255,0.03)"
                          //   : "rgba(0,0,0,0.02)",
                          marginBottom: "12px",
                          opacity: futureCheck ? 0.5 : pastCheck ? 0.7 : 1,
                          background: "transparent",
                          // borderRadius: 0,
                          border: "none",
                          overflow: "hidden",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleHabit(item.id, dateStr)}
                          disabled={futureCheck}
                          style={{
                            width: "24px",
                            height: "24px",
                            accentColor: t.primary,
                            cursor: futureCheck ? "not-allowed" : "pointer",
                          }}
                        />
                        <span style={{ fontSize: "20px" }}>{item.icon}</span>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: checked ? "600" : "500",
                            color: checked ? t.success : t.text,
                            textDecoration: checked ? "line-through" : "none",
                            flex: 1,
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop View */
          <div
            style={{
              overflowX: "auto",
              width: "100%",
              overflowY: "hidden",
              maxWidth: "100%",
              borderRadius: "16px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      borderBottom: `2px solid ${t.border}`,
                      borderRight: `2px solid rgb(45, 55, 72)`,
                      background: isDark ? "rgb(30 35 50)" : "rgba(0,0,0,0.02)",
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      minWidth: "220px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: t.text,
                      }}
                    >
                      Routine Items
                    </span>
                  </th>
                  {weekDates.map((date, idx) => {
                    const todayCheck = isToday(date);
                    const pastCheck = isPast(date);
                    const futureCheck = isFuture(date);
                    const dateStr = `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}`;

                    return (
                      <th
                        key={idx}
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          borderBottom: `2px solid ${t.border}`,
                          background: todayCheck
                            ? isDark
                              ? "rgba(160,90,255,0.15)"
                              : "rgba(160,90,255,0.1)"
                            : isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                          borderLeft: todayCheck
                            ? `2px solid ${t.primary}`
                            : "none",
                          borderRight: todayCheck
                            ? `2px solid ${t.primary}`
                            : "none",
                          minWidth: "120px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: todayCheck
                              ? t.primary
                              : pastCheck
                              ? t.textSecondary
                              : t.text,
                            marginBottom: "4px",
                          }}
                        >
                          {getDayName(date)}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: t.textSecondary,
                            marginBottom: "8px",
                          }}
                        >
                          {formatDate(date)}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleMarkAll(dateStr)}
                            disabled={futureCheck}
                            style={{
                              padding: "4px 8px",
                              background: futureCheck ? t.border : t.success,
                              border: "none",
                              borderRadius: "4px",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: "600",
                              cursor: futureCheck ? "not-allowed" : "pointer",
                              opacity: futureCheck ? 0.5 : 1,
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!futureCheck)
                                e.currentTarget.style.opacity = "0.8";
                            }}
                            onMouseLeave={(e) => {
                              if (!futureCheck)
                                e.currentTarget.style.opacity = "1";
                            }}
                          >
                            ✓ All
                          </button>
                          <button
                            onClick={() => handleResetAll(dateStr)}
                            disabled={futureCheck}
                            style={{
                              padding: "4px 8px",
                              background: futureCheck ? t.border : t.danger,
                              border: "none",
                              borderRadius: "4px",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: "600",
                              cursor: futureCheck ? "not-allowed" : "pointer",
                              opacity: futureCheck ? 0.5 : 1,
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!futureCheck)
                                e.currentTarget.style.opacity = "0.8";
                            }}
                            onMouseLeave={(e) => {
                              if (!futureCheck)
                                e.currentTarget.style.opacity = "1";
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {routineItems.map((item, itemIdx) => (
                  <tr
                    key={item.id}
                    style={{
                      background:
                        itemIdx % 2 === 0
                          ? "transparent"
                          : isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.01)",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        borderBottom: `1px solid ${t.border}`,
                        borderRight: `2px solid rgb(45, 55, 72)`,
                        position: "sticky",
                        left: 0,
                        background:
                          itemIdx % 2 === 0
                            ? t.cardBg
                            : isDark
                            ? "rgb(30 35 50)"
                            : "rgba(0,0,0,0.01)",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>{item.icon}</span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: t.text,
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    </td>
                    {weekDates.map((date, dateIdx) => {
                      const dateStr = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(2, "0")}-${String(date.getDate()).padStart(
                        2,
                        "0"
                      )}`;

                      const key = `${item.id}-${dateStr}`;
                      const checked = executions[key] || false;
                      const todayCheck = isToday(date);
                      const pastCheck = isPast(date);
                      const futureCheck = isFuture(date);

                      return (
                        <td
                          key={dateIdx}
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            borderBottom: `1px solid ${t.border}`,
                            background: todayCheck
                              ? isDark
                                ? "rgba(160,90,255,0.05)"
                                : "rgba(160,90,255,0.03)"
                              : "transparent",
                            borderLeft: todayCheck
                              ? `2px solid ${t.primary}`
                              : "none",
                            borderRight: todayCheck
                              ? `2px solid ${t.primary}`
                              : "none",
                            opacity: futureCheck ? 0.5 : pastCheck ? 0.7 : 1,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleHabit(item.id, dateStr)}
                            disabled={futureCheck}
                            style={{
                              width: "20px",
                              height: "20px",
                              cursor: futureCheck ? "not-allowed" : "pointer",
                              accentColor: t.primary,
                              transform: "scale(1.2)",
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ExecutionHubPage;
