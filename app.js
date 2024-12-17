let tasks = [];
let filteredTasks = []; // To store the filtered tasks based on category or search

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('task', JSON.stringify(tasks));
}

// Add a new task
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("categorySelect");
    const text = taskInput.value.trim();
    const category = categorySelect.value;

    if (text) {
        tasks.push({ text: text, completed: false, category: category });
        taskInput.value = ""; // Clear the input field
        updateTasksList();
        updateProgress();
        saveTasks();
    }
};

// Update the task list in the DOM
const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the current list

    const tasksToDisplay = filteredTasks.length > 0 ? filteredTasks : tasks;

    tasksToDisplay.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        listItem.innerHTML = `
        <div class="taskItem">
        <div class="task ${task.completed ? "completed" : ""}">
            <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} 
                onchange="toggleTaskComplete(${index})" />
            <p>${task.text} (${task.category})</p>
            <div class="icons">
                <img src="./img/edit.png" onclick="editTask(${index})">
                <img src="./img/bin.png" onclick="deleteTask(${index})">
            </div>
        </div>
        `;

        taskList.appendChild(listItem);
    });
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateProgress();
    saveTasks();
};

// Edit a task
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    taskInput.value = tasks[index].text;
    categorySelect.value = tasks[index].category;
    
    tasks.splice(index, 1);
    updateTasksList();
    saveTasks();
};

// Delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateProgress();
    saveTasks();
};

// Update progress bar and stats
const updateProgress = () => {
    const progressBar = document.getElementById("progress");
    const numbers = document.getElementById("numbers");

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    progressBar.style.width = `${progressPercentage}%`;
    numbers.textContent = `${completedTasks} / ${totalTasks}`;
    
    if (tasks.length && completedTasks === totalTasks) {
        blaskconfetti();
    }
};

// Add event listener to the "Add Task" button
document.getElementById("newTask").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    addTask();
});

// Search tasks
const searchTasks = () => {
    const searchQuery = document.getElementById("searchBar").value.toLowerCase();
    filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchQuery));
    updateTasksList();
};

// Filter tasks by category
const filterByCategory = () => {
    const category = document.getElementById("categoryFilter").value;
    filteredTasks = category ? tasks.filter(task => task.category === category) : [];
    updateTasksList();
};

// Confetti effect
const blaskconfetti = () => {
    const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
  
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
  
    const particleCount = 50 * (timeLeft / duration);
  
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
        }

// Load tasks from localStorage on page load
const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('task'));
    if (storedTasks) {
        tasks = storedTasks;
        updateTasksList();
        updateProgress();
    }
};

loadTasks(); // Call this function when the page loads
