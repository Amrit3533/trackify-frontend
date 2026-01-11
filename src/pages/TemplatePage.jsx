import API from "../api/api";
import { useEffect } from "react";
import React, { useState } from "react";

const TemplatePage = ({ t, setToastMessage, setShowToast, isDark }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "✨" });
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await API.get("/routine/template");

        if (res.data?.columns) {
          setHabits(res.data.columns);
        }
      } catch (err) {
        console.error("Failed to fetch template", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  const handleSaveTemplate = async (data) => {
    if (!data || !data.length) return;

    await API.post("/routine/template", {
      columns: data,
    });

    const refreshed = await API.get("/routine/template");
    setHabits(refreshed.data.columns);
  };

  const generateHabitId = (name) =>
    `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;
    if (
      habits.some((h) => h.name.toLowerCase() === newHabit.name.toLowerCase())
    ) {
      setToastMessage("Habit already exists");
      setShowToast(true);
      return;
    }

    const habit = {
      id: generateHabitId(newHabit.name),
      name: newHabit.name,
      icon: newHabit.icon,
      active: true,
    };

    const updatedHabits = [...habits, habit];

    setHabits(updatedHabits);
    await handleSaveTemplate(updatedHabits);

    setNewHabit({ name: "", icon: "✨" });
    setShowAddModal(false);

    setToastMessage("Habit added successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const deleteHabit = async (id) => {
    await API.delete(`/routine/habit/${id}`);

    const refreshed = await API.get("/routine/template");
    setHabits(refreshed.data.columns);

    setToastMessage("Habit deleted successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const toggleHabitStatus = async (id) => {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, active: !h.active } : h
    );

    setHabits(updated);
    await handleSaveTemplate(updated);
  };

  const emojiOptions = [
    "🧘",
    "💪",
    "📚",
    "💧",
    "🥗",
    "💻",
    "🚶",
    "📝",
    "😴",
    "📵",
    "🎯",
    "🏃",
    "🧠",
    "🎨",
    "🎵",
    "☕",
  ];

  const updateHabit = async (habitId, updates) => {
    // 1️⃣ Update local state
    const updatedHabits = habits.map((h) =>
      h.id === habitId ? { ...h, ...updates } : h
    );

    setHabits(updatedHabits);

    // 2️⃣ Persist to backend (single source of truth)
    try {
      await API.post("/routine/template", {
        columns: updatedHabits,
      });
    } catch (err) {
      console.error("Failed to update habit", err);
    }
  };

  if (loading) {
    return <div style={{ padding: 32 }}>Loading template...</div>;
  }

  return (
    <div style={{ display: "flex", background: t.bg }}>
      <div
        style={{
          flex: 1,
          padding: isMobile ? "20px" : "32px",
          maxWidth: "100%",
          overflow: "auto",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: "600",
                  color: t.text,
                  marginBottom: "8px",
                }}
              >
                Habit Template
              </h1>
              <p style={{ fontSize: "14px", color: t.textSecondary }}>
                Manage your daily habits and routines
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: t.gradient1,
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <span style={{ fontSize: "18px" }}>+</span>
              Add New Habit
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: t.primary,
                  marginBottom: "8px",
                }}
              >
                {habits.length}
              </div>
              <div style={{ fontSize: "14px", color: t.textSecondary }}>
                Total Habits
              </div>
            </div>
            <div
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: t.success,
                  marginBottom: "8px",
                }}
              >
                {habits.filter((h) => h.active).length}
              </div>
              <div style={{ fontSize: "14px", color: t.textSecondary }}>
                Active Habits
              </div>
            </div>
            <div
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: t.textSecondary,
                  marginBottom: "8px",
                }}
              >
                {habits.filter((h) => !h.active).length}
              </div>
              <div style={{ fontSize: "14px", color: t.textSecondary }}>
                Inactive Habits
              </div>
            </div>
          </div>

          {/* Habits List */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {habits.map((habit) => (
              <div
                key={habit.id}
                style={{
                  background: t.cardBg,
                  border: `2px solid ${
                    habit.active ? t.border : t.textSecondary
                  }`,
                  borderRadius: "16px",
                  padding: "24px",
                  position: "relative",
                  transition: "all 0.3s",
                  opacity: habit.active ? 1 : 0.6,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* Status Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "4px 12px",
                    background: habit.active ? t.success : t.textSecondary,
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  {habit.active ? "Active" : "Inactive"}
                </div>

                {/* Icon and Name */}
                {editingHabit === habit.id ? (
                  <div style={{ marginTop: "20px" }}>
                    <select
                      value={habit.icon}
                      onChange={(e) =>
                        updateHabit(habit.id, { icon: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "12px",
                        background: isDark ? t.bg : "#F8FAFC",
                        border: `1px solid ${t.border}`,
                        borderRadius: "8px",
                        color: t.text,
                        fontSize: "24px",
                        cursor: "pointer",
                      }}
                    >
                      {emojiOptions.map((emoji) => (
                        <option key={emoji} value={emoji}>
                          {emoji}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={habit.name}
                      onChange={(e) =>
                        updateHabit(habit.id, { name: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: isDark ? t.bg : "#F8FAFC",
                        border: `1px solid ${t.border}`,
                        borderRadius: "8px",
                        color: t.text,
                        fontSize: "15px",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "16px",
                        marginTop: "12px",
                      }}
                    >
                      {habit.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: t.text,
                        marginBottom: "20px",
                      }}
                    >
                      {habit.name}
                    </h3>
                  </>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {editingHabit === habit.id ? (
                    <button
                      onClick={() => setEditingHabit(null)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: t.success,
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Done
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingHabit(habit.id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: t.primary,
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleHabitStatus(habit.id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: habit.active ? t.warning : t.success,
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {habit.active ? "Deactivate" : "Activate"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    style={{
                      padding: "10px 16px",
                      background: t.danger,
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Modal */}
          {showAddModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                padding: "20px",
              }}
              onClick={() => setShowAddModal(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: t.cardBg,
                  borderRadius: "20px",
                  padding: isMobile ? "32px 24px" : "40px",
                  maxWidth: "500px",
                  width: "100%",
                  border: `1px solid ${t.border}`,
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: t.text,
                    marginBottom: "24px",
                  }}
                >
                  Add New Habit
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: t.text,
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Choose Icon
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setNewHabit({ ...newHabit, icon: emoji })
                        }
                        style={{
                          padding: "8px",
                          background:
                            newHabit.icon === emoji
                              ? t.primary
                              : isDark
                              ? t.bg
                              : "#F8FAFC",
                          border: `2px solid ${
                            newHabit.icon === emoji ? t.primary : t.border
                          }`,
                          borderRadius: "8px",
                          fontSize: "24px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      color: t.text,
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, name: e.target.value })
                    }
                    placeholder="e.g., Morning Yoga"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: isDark ? t.bg : "#F8FAFC",
                      border: `1px solid ${t.border}`,
                      borderRadius: "8px",
                      color: t.text,
                      fontSize: "15px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "transparent",
                      border: `1px solid ${t.border}`,
                      borderRadius: "8px",
                      color: t.text,
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addHabit}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: t.gradient1,
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Add Habit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TemplatePage;
