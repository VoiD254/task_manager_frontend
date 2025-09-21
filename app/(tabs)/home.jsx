import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 5));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 9, 5));
  const [tasks, setTasks] = useState({
    "2024-10-5": [
      {
        id: 1,
        title: "Meeting with Alex",
        time: "10:00 AM",
        completed: false,
        description: "Discuss project timeline and deliverables",
      },
      {
        id: 2,
        title: "Lunch with Sarah",
        time: "1:00 PM",
        completed: false,
        description: "Catch up and discuss new opportunities",
      },
      {
        id: 3,
        title: "Project review",
        time: "3:00 PM",
        completed: false,
        description: "Review code and documentation for Q4 project",
      },
    ],
    "2024-10-8": [
      {
        id: 4,
        title: "Team standup",
        time: "9:00 AM",
        completed: false,
        description: "Daily sync with development team",
      },
      {
        id: 5,
        title: "Client presentation",
        time: "2:00 PM",
        completed: false,
        description: "Present final designs and get client feedback",
      },
    ],
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTask, setEditTask] = useState({
    title: "",
    time: new Date(),
    description: "",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    time: new Date(),
    description: "",
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectDate = (day) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelectedDate);
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const formatDateDisplay = (date) => {
    const options = { month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleTaskComplete = (taskId) => {
    const dateKey = formatDateKey(selectedDate);
    setTasks((prev) => ({
      ...prev,
      [dateKey]:
        prev[dateKey]?.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ) || [],
    }));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const dateKey = formatDateKey(selectedDate);
      const task = {
        id: Date.now(),
        title: newTask.title,
        time: formatTime(newTask.time),
        description: newTask.description,
        completed: false,
      };

      setTasks((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), task],
      }));

      setNewTask({ title: "", time: new Date(), description: "" });
      setShowAddTask(false);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNewTask((prev) => ({ ...prev, time: selectedTime }));
    }
  };

  const onEditTimeChange = (event, selectedTime) => {
    setShowEditTimePicker(false);
    if (selectedTime) {
      setEditTask((prev) => ({ ...prev, time: selectedTime }));
    }
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    // Convert time string back to Date object for editing
    const [time, modifier] = task.time.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;

    const taskDate = new Date();
    taskDate.setHours(hour, parseInt(minutes), 0, 0);

    setEditTask({
      title: task.title,
      time: taskDate,
      description: task.description || "",
    });
    setIsEditMode(false);
    setShowTaskDetail(true);
  };

  const updateTask = () => {
    if (editTask.title.trim() && selectedTask) {
      const dateKey = formatDateKey(selectedDate);
      const updatedTask = {
        ...selectedTask,
        title: editTask.title,
        time: formatTime(editTask.time),
        description: editTask.description,
      };

      setTasks((prev) => ({
        ...prev,
        [dateKey]:
          prev[dateKey]?.map((task) =>
            task.id === selectedTask.id ? updatedTask : task
          ) || [],
      }));

      setSelectedTask(updatedTask);
      setIsEditMode(false);
    }
  };

  const deleteTask = () => {
    if (selectedTask) {
      const dateKey = formatDateKey(selectedDate);
      setTasks((prev) => ({
        ...prev,
        [dateKey]:
          prev[dateKey]?.filter((task) => task.id !== selectedTask.id) || [],
      }));
      setShowTaskDetail(false);
      setSelectedTask(null);
      setIsEditMode(false);
    }
  };

  // Check if date has pending (non-completed) tasks
  const hasPendingTasks = (date) => {
    const dateKey = formatDateKey(date);
    const dateTasks = tasks[dateKey] || [];
    return dateTasks.some((task) => !task.completed);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      const hasPending = hasPendingTasks(dayDate);

      days.push(
        <View key={day} style={styles.calendarDay}>
          <TouchableOpacity
            onPress={() => selectDate(day)}
            style={[styles.dayButton, isSelected && styles.selectedDayButton]}
          >
            <Text
              style={[styles.dayText, isSelected && styles.selectedDayText]}
            >
              {day}
            </Text>
            {hasPending && !isSelected && <View style={styles.taskIndicator} />}
          </TouchableOpacity>
        </View>
      );
    }

    return days;
  };

  const currentTasks = tasks[formatDateKey(selectedDate)] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#323232" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.spacer} />
          <Text style={styles.headerTitle}>Tasks</Text>
          <TouchableOpacity
            onPress={() => setShowAddTask(true)}
            style={styles.headerButton}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.main}>
        <View style={styles.content}>
          {/* Calendar Navigation */}
          <View style={styles.calendarNav}>
            <TouchableOpacity
              onPress={() => navigateMonth(-1)}
              style={styles.navButton}
            >
              <Text style={styles.navIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity
              onPress={() => navigateMonth(1)}
              style={styles.navButton}
            >
              <Text style={styles.navIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {/* Day headers */}
            <View style={styles.dayHeaders}>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.dayHeader}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar days */}
            <View style={styles.calendarGrid}>{renderCalendar()}</View>
          </View>

          {/* Selected Date Tasks */}
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksTitle}>
              {formatDateDisplay(selectedDate)}
            </Text>
          </View>

          <View style={styles.tasksList}>
            {currentTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tasks for this day</Text>
              </View>
            ) : (
              currentTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => openTaskDetail(task)}
                >
                  <View style={styles.taskItem}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleTaskComplete(task.id);
                      }}
                      style={[
                        styles.checkbox,
                        task.completed && styles.checkedBox,
                      ]}
                    >
                      {task.completed && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                    <View style={styles.taskContent}>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && styles.completedTask,
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Text style={styles.taskTime}>{task.time}</Text>
                      {task.description && (
                        <Text style={styles.taskPreview} numberOfLines={1}>
                          {task.description}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={showAddTask} transparent={true} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            setShowAddTask(false);
            setNewTask({ title: "", time: new Date(), description: "" });
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Add New Task</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Task title"
                  placeholderTextColor="#999"
                  value={newTask.title}
                  onChangeText={(text) =>
                    setNewTask((prev) => ({ ...prev, title: text }))
                  }
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Task Description (optional)"
                  placeholderTextColor="#999"
                  value={newTask.description}
                  onChangeText={(text) =>
                    setNewTask((prev) => ({ ...prev, description: text }))
                  }
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timePickerText}>
                    {formatTime(newTask.time)}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={newTask.time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddTask(false);
                      setNewTask({
                        title: "",
                        time: new Date(),
                        description: "",
                      });
                    }}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={addTask}
                    style={[styles.button, styles.addButton]}
                  >
                    <Text style={styles.addButtonText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Task Detail Modal */}
      <Modal visible={showTaskDetail} transparent={true} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            setShowTaskDetail(false);
            setIsEditMode(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.taskDetailHeader}>
                <Text style={styles.modalTitle}>
                  {isEditMode ? "Edit Task" : "Task Details"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowTaskDetail(false);
                    setIsEditMode(false);
                  }}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {selectedTask && (
                <View style={styles.taskDetailContent}>
                  {isEditMode ? (
                    // Edit Mode - Show input fields
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Task title"
                        placeholderTextColor="#999"
                        value={editTask.title}
                        onChangeText={(text) =>
                          setEditTask((prev) => ({ ...prev, title: text }))
                        }
                      />

                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Task Description (optional)"
                        placeholderTextColor="#999"
                        value={editTask.description}
                        onChangeText={(text) =>
                          setEditTask((prev) => ({
                            ...prev,
                            description: text,
                          }))
                        }
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                      />

                      <TouchableOpacity
                        style={styles.timePickerButton}
                        onPress={() => setShowEditTimePicker(true)}
                      >
                        <Text style={styles.timePickerText}>
                          {formatTime(editTask.time)}
                        </Text>
                      </TouchableOpacity>

                      {showEditTimePicker && (
                        <DateTimePicker
                          value={editTask.time}
                          mode="time"
                          display="default"
                          onChange={onEditTimeChange}
                        />
                      )}

                      <View style={styles.taskStatusContainer}>
                        <Text style={styles.statusLabel}>Status: </Text>
                        <Text
                          style={[
                            styles.statusText,
                            selectedTask.completed
                              ? styles.completedStatus
                              : styles.pendingStatus,
                          ]}
                        >
                          {selectedTask.completed ? "Completed" : "Pending"}
                        </Text>
                      </View>
                    </>
                  ) : (
                    // View Mode - Show task details
                    <>
                      <Text style={styles.taskDetailTitle}>
                        {selectedTask.title}
                      </Text>
                      <Text style={styles.taskDetailTime}>
                        {selectedTask.time}
                      </Text>

                      {selectedTask.description ? (
                        <View style={styles.descriptionContainer}>
                          <Text style={styles.descriptionLabel}>
                            Description:
                          </Text>
                          <Text style={styles.taskDetailDescription}>
                            {selectedTask.description}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.noDescription}>
                          No description provided
                        </Text>
                      )}

                      <View style={styles.taskStatusContainer}>
                        <Text style={styles.statusLabel}>Status: </Text>
                        <Text
                          style={[
                            styles.statusText,
                            selectedTask.completed
                              ? styles.completedStatus
                              : styles.pendingStatus,
                          ]}
                        >
                          {selectedTask.completed ? "Completed" : "Pending"}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Buttons based on mode */}
              {isEditMode ? (
                // Edit Mode Buttons - Cancel and Save
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setIsEditMode(false)}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={updateTask}
                    style={[styles.button, styles.addButton]}
                  >
                    <Text style={styles.addButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // View Mode Buttons - Edit and Delete
                <View style={styles.taskDetailButtons}>
                  <TouchableOpacity
                    onPress={() => setIsEditMode(true)}
                    style={[
                      styles.button,
                      styles.addButton,
                      styles.fullWidthButton,
                    ]}
                  >
                    <Text style={styles.addButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={deleteTask}
                    style={[
                      styles.button,
                      styles.deleteButton,
                      styles.fullWidthButton,
                    ]}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity onPress={() => setShowAddTask(true)} style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#323232",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#666",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    paddingHorizontal: 16,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  spacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#eeecec",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    fontSize: 24,
    color: "#eeecec",
  },
  main: {
    flex: 1,
  },
  content: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    paddingBottom: 100,
  },
  calendarNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 20,
    color: "#eeecec",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#eeecec",
  },
  calendar: {
    paddingHorizontal: 16,
  },
  dayHeaders: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dayHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    textAlign: "center",
    flex: 1,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  selectedDayButton: {
    backgroundColor: "#3B82F6",
  },
  dayText: {
    fontSize: 14,
    color: "#eeecec",
  },
  selectedDayText: {
    color: "white",
  },
  taskIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#60A5FA",
  },
  tasksHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#eeecec",
  },
  tasksList: {
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#eeecec",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  taskTime: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  taskPreview: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 4,
    fontStyle: "italic",
  },
  chevron: {
    fontSize: 18,
    color: "#999",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: "#323232",
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#666",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#eeecec",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#666",
    color: "#eeecec",
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    maxHeight: 120,
  },
  timePickerButton: {
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  timePickerText: {
    color: "#eeecec",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#666",
  },
  cancelButtonText: {
    color: "#eeecec",
  },
  addButton: {
    backgroundColor: "#3B82F6",
  },
  addButtonText: {
    color: "white",
    fontWeight: "500",
  },
  fullWidthButton: {
    flex: undefined,
    width: "100%",
    marginTop: 8,
  },
  taskDetailButtons: {
    gap: 8,
    marginTop: 16,
  },
  editButton: {
    backgroundColor: "#F59E0B",
    flex: 1,
  },
  editButtonText: {
    color: "white",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "500",
  },
  taskDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#666",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#eeecec",
    fontSize: 20,
    fontWeight: "bold",
  },
  taskDetailContent: {
    marginBottom: 16,
  },
  taskDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#eeecec",
    marginBottom: 8,
  },
  taskDetailTime: {
    fontSize: 16,
    color: "#3B82F6",
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#eeecec",
    marginBottom: 8,
  },
  taskDetailDescription: {
    fontSize: 16,
    color: "#bbb",
    lineHeight: 24,
  },
  noDescription: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 16,
  },
  taskStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: "#eeecec",
    fontWeight: "600",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  completedStatus: {
    color: "#22C55E",
  },
  pendingStatus: {
    color: "#F59E0B",
  },
  fab: {
    position: "absolute",
    bottom: 120,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: "white",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#666",
    marginBottom: 25,
    paddingTop: 7,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 64,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  footerItem: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  homeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  profileIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  footerActiveText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  footerInactiveText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#999",
  },
});

export default TaskManager;
