document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const priorityInput = document.getElementById('priorityInput');
    const categoryInput = document.getElementById('categoryInput');
    const reminderDateInput = document.getElementById('reminderDateInput');
    const reminderTimeInput = document.getElementById('reminderTimeInput');

    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    const category = categoryInput.value;
    const reminderDate = reminderDateInput.value; // Get date value
    const reminderTime = reminderTimeInput.value; // Get time value

    if (taskText !== "") {
        const taskItem = createTaskElement(taskText, priority, category, reminderDate, reminderTime); // Pass date and time
        taskList.appendChild(taskItem);
        saveTask(taskText, priority, category, reminderDate, reminderTime); // Save date and time
        taskInput.value = "";
        reminderDateInput.value = ""; // Clear date input
        reminderTimeInput.value = ""; // Clear time input
    }
}

function createTaskElement(taskText, priority, category, reminderDate, reminderTime) {
    const taskItem = document.createElement('li');
    taskItem.classList.add(priority + '-priority');
    let reminderText = ""; // Initialize reminder text
    if (reminderDate && reminderTime) {
        reminderText = `<span class="task-reminder">Reminder: ${reminderDate} ${reminderTime}</span>`;
    } else if (reminderDate) {
        reminderText = `<span class="task-reminder">Reminder Date: ${reminderDate}</span>`;
    } else if (reminderTime) {
        reminderText = `<span class="task-reminder">Reminder Time: ${reminderTime}</span>`;
    }

    taskItem.innerHTML = `
        <span class="task-text">${taskText}</span>
        <span class="task-category">Category: ${category}</span>
        <span class="task-priority">Priority: ${priority}</span>
        ${reminderText}  <button onclick="removeTask(this)">Delete</button>
    `;
    return taskItem;
}


function removeTask(deleteButton) {
    const taskList = document.getElementById('taskList');
    const taskItem = deleteButton.parentElement;
    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskPriority = taskItem.querySelector('.task-priority').textContent.replace('Priority: ', '');
    const taskCategory = taskItem.querySelector('.task-category').textContent.replace('Category: ', '');
    const taskReminder = taskItem.querySelector('.task-reminder')?.textContent || ""; // Get reminder text, handle if not present

    taskList.removeChild(taskItem);
    removeSavedTask(taskText, taskPriority, taskCategory, taskReminder); // Remove with reminder
}


function saveTask(taskText, priority, category, reminderDate, reminderTime) {
    let tasks = getTasksFromStorage();
    tasks.push({ text: taskText, priority: priority, category: category, reminderDate: reminderDate, reminderTime: reminderTime }); // Save date and time
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    let tasks = getTasksFromStorage();
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.priority, task.category, task.reminderDate, task.reminderTime); // Load date and time
        taskList.appendChild(taskItem);
    });
}

function getTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}


function removeSavedTask(taskText, priority, category, reminderText) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => !(
        task.text === taskText &&
        task.priority === priority &&
        task.category === category &&
        (task.reminderDate + " " + task.reminderTime).trim() === reminderText.replace("Reminder: ", "").replace("Reminder Date: ", "").replace("Reminder Time: ", "").trim() // Compare reminder
    ));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
