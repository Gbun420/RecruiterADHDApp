document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const priorityInput = document.getElementById('priorityInput');
    const categoryInput = document.getElementById('categoryInput');

    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    const category = categoryInput.value;

    if (taskText !== "") {
        const taskItem = createTaskElement(taskText, priority, category); // Pass priority and category
        taskList.appendChild(taskItem);
        saveTask(taskText, priority, category); // Save priority and category
        taskInput.value = "";
    }
}

function createTaskElement(taskText, priority, category) {
    const taskItem = document.createElement('li');
    taskItem.classList.add(priority + '-priority'); // Add class for priority styling
    taskItem.innerHTML = `
        <span class="task-text">${taskText}</span>
        <span class="task-category">Category: ${category}</span>
        <span class="task-priority">Priority: ${priority}</span>
        <button onclick="removeTask(this)">Delete</button>
    `;
    return taskItem;
}


function removeTask(deleteButton) {
    const taskList = document.getElementById('taskList');
    const taskItem = deleteButton.parentElement;
    const taskText = taskItem.querySelector('.task-text').textContent; // Select by class
    const taskPriority = taskItem.querySelector('.task-priority').textContent.replace('Priority: ', ''); // Extract priority
    const taskCategory = taskItem.querySelector('.task-category').textContent.replace('Category: ', ''); // Extract category


    taskList.removeChild(taskItem);
    removeSavedTask(taskText, taskPriority, taskCategory); // Remove with priority and category
}

function saveTask(taskText, priority, category) {
    let tasks = getTasksFromStorage();
    tasks.push({ text: taskText, priority: priority, category: category }); // Save as object
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    let tasks = getTasksFromStorage();
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.priority, task.category); // Load priority and category
        taskList.appendChild(taskItem);
    });
}

function getTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}


function removeSavedTask(taskText, priority, category) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => !(task.text === taskText && task.priority === priority && task.category === category)); // Filter based on all properties
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
