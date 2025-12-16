
// Student: ادم زكريا عبد الكريم نصار (12427909)

const STUDENT_ID = "12427909";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}


document.addEventListener("DOMContentLoaded", function () {
  fetch(API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY)
    .then(response => response.json())
    .then(data => {
      if (data.tasks && data.tasks.length > 0) {
        data.tasks.forEach(task => renderTask(task));
        setStatus("Task added successfully.");
      }
    })
    .catch(error => {
      setStatus("Error loading tasks", true);
    });
});


if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const title = input.value.trim();
    if (!title) return;
    
    fetch(API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(data => {
      if (data.task) {
        renderTask(data.task);
        setStatus("Task added successfully.");
        input.value = "";
      }
    })
    .catch(error => {
      setStatus("Error adding task", true);
    });
  });
}


function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  
  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;
  
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";
  
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function() {
    deleteTask(task.id, li);
  };
  
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(titleSpan);
  li.appendChild(actionsDiv);
  list.appendChild(li);
}


function deleteTask(taskId, element) {
  fetch(API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + taskId)
    .then(response => response.json())
    .then(data => {
      element.remove();
      setStatus("Task deleted successfully.");
    })
    .catch(error => {
      setStatus("Error deleting task", true);
    });
}