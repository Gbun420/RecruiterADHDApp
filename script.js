document.addEventListener('DOMContentLoaded', function() {
    loadTasks(); // Load tasks from local storage on page load
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        saveTask(taskText); // Save task to local storage
        taskInput.value = ""; // Clear input field
    }
}

function createTaskElement(taskText) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <button onclick="removeTask(this)">Delete</button>
    `;
    return taskItem;
}


function removeTask(deleteButton) {
    const taskList = document.getElementById('taskList');
    const taskItem = deleteButton.parentElement;
    const taskText = taskItem.querySelector('span').textContent;

    taskList.removeChild(taskItem);
    removeSavedTask(taskText); // Remove task from local storage
}

function saveTask(taskText) {
    let tasks = getTasksFromStorage();
    tasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    let tasks = getTasksFromStorage();
    tasks.forEach(taskText => {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
    });
}

function getTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

function removeSavedTask(taskText) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task !== taskText); // Keep tasks that are not the one to be removed
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
