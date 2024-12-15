// Get main input and buttons
let inp = document.querySelector(".totodo-inp .inp");
let addTasks = document.querySelector(".add-tasks");
let todoList = document.querySelector(".todo-list");

// Add task functionality
addTasks.addEventListener("click", () => {
  // Get existing tasks from localStorage or initialize an empty array
  let myTasks = JSON.parse(localStorage.getItem("task")) || [];

  // Create a new task object
  let taskObj = {
    task: inp.value.trim(),
    completed: false, // Add a completed status
  };

  // Add the new task to the array
  myTasks.push(taskObj);

  // Save the updated array back to localStorage
  localStorage.setItem("task", JSON.stringify(myTasks));

  // Clear the input field
  inp.value = "";

  // Add the task to the DOM
  addTask(taskObj);

  // Show added message
  showNotification("Task added!");
});

// Function to create a task HTML element and append it to the todo list
function addTask(taskObj) {
  let taskDiv = document.createElement("div");
  taskDiv.classList.add("my-tasks");
  taskDiv.innerHTML =
    localStorage.length > 0
      ? `
    <div class="todo-check">
      <input type="checkbox" ${taskObj.completed ? "checked" : ""} />
      <label>${taskObj.task}</label>
      <input type="text" class="edit-input" style="display: none;" />
    </div>
    <div class="icons">
      <i class="fa-regular fa-pen-to-square"></i>
      <i class="fa-regular fa-trash-can"></i>
    </div>
  `
      : `<p>no tasks added</p>`;

  // Add the task to the list
  todoList.appendChild(taskDiv);

  // Hide the "no tasks" message
  checkIfNoTasks();

  // Handle marking the task as completed
  let checkbox = taskDiv.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", () => {
    taskObj.completed = checkbox.checked;
    updateTaskInLocalStorage(taskObj);
    taskDiv.classList.toggle("completed", taskObj.completed);
  });

  // Handle editing the task
  let editIcon = taskDiv.querySelector(".fa-pen-to-square");
  let label = taskDiv.querySelector("label");
  let editInput = taskDiv.querySelector(".edit-input");

  editIcon.addEventListener("click", () => {
    // Show the input and hide the label
    editInput.value = taskObj.task;
    editInput.style.display = "block";
    label.style.display = "none";

    // Focus on the input field
    editInput.focus();
  });

  // Handle saving the edited task
  editInput.addEventListener("blur", () => {
    if (editInput.value.trim() !== "") {
      // Update task in localStorage
      let oldTask = taskObj.task; // Store the old task value
      taskObj.task = editInput.value.trim();
      updateTaskInLocalStorage(taskObj, oldTask);

      // Update the label text and switch back
      label.textContent = taskObj.task;
    }
    editInput.style.display = "none";
    label.style.display = "block";
  });

  // Add event listener to the trash icon to delete the task
  taskDiv.querySelector(".fa-trash-can").addEventListener("click", () => {
    removeTaskFromDOM(taskDiv, taskObj);
  });

  // Toggle the "completed" class if the task is marked as completed
  if (taskObj.completed) {
    taskDiv.classList.add("completed");
  }
}

// Function to remove task from DOM and localStorage
function removeTaskFromDOM(taskDiv, taskObj) {
  // Remove the task from the DOM
  todoList.removeChild(taskDiv);

  // Get the tasks from localStorage
  let myTasks = JSON.parse(localStorage.getItem("task"));

  // Remove the task from the array
  myTasks = myTasks.filter((task) => task.task !== taskObj.task);

  // Save the updated array back to localStorage
  localStorage.setItem("task", JSON.stringify(myTasks));

  // Check if there are no tasks left
  checkIfNoTasks();

  // Show removed message
  showNotification("Task removed!");
}

// Function to update task in localStorage
function updateTaskInLocalStorage(updatedTask, oldTask = null) {
  let myTasks = JSON.parse(localStorage.getItem("task")) || [];
  myTasks = myTasks.map((task) => {
    // Match by old task name (if editing) or updated task directly
    if (oldTask ? task.task === oldTask : task.task === updatedTask.task) {
      return updatedTask;
    }
    return task;
  });
  localStorage.setItem("task", JSON.stringify(myTasks));
}

// Load existing tasks from localStorage and add them to the DOM
let allTask = JSON.parse(localStorage.getItem("task")) || [];
allTask.forEach((task) => {
  addTask(task);
});

function checkIfNoTasks() {
  let myTasks = JSON.parse(localStorage.getItem("task")) || [];
  let noTasksMessage = document.querySelector(".no-tasks-message");

  if (myTasks.length === 0) {
    if (!noTasksMessage) {
      noTasksMessage = document.createElement("p");
      noTasksMessage.classList.add("no-tasks-message");
      noTasksMessage.textContent = "No tasks added";
      todoList.appendChild(noTasksMessage);
    }
  } else {
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
  }
}

// Load existing tasks from localStorage and add them to the DOM
let allTasks = JSON.parse(localStorage.getItem("task")) || [];
if (allTasks.length === 0) {
  checkIfNoTasks(); // Show "no tasks added" if there are no tasks
} else {
  allTasks.forEach((task) => {
    addTask(task);
  });
}

// Add a message div for notifications
let notification = document.createElement("div");
notification.classList.add("notification");
document.body.appendChild(notification);

// Function to show notification
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("visible");

  // Hide the notification after 2 seconds
  setTimeout(() => {
    notification.classList.remove("visible");
  }, 2000);
}
