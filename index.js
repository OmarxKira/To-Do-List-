document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => displayTask(task));
});

document.getElementById('addTaskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskImageInput = document.getElementById('taskImage');
    const subTasksInput = document.getElementById('subTasks').value;
    const subTasks = subTasksInput ? subTasksInput.split(",").map(tasks => tasks.trim()).filter(tasks => tasks.length > 0) : [];

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;

        const task = {
            ID: Date.now(),
            taskName,
            imageUrl,
            subTasks
        };

        displayTask(task);

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        document.getElementById('addTaskForm').reset();

        const addTaskModal = document.getElementById('addTaskModal');
        const modalInstance = bootstrap.Modal.getInstance(addTaskModal);
        modalInstance.hide();

        
    };

    if (taskImageInput.files && taskImageInput.files[0]) {
        reader.readAsDataURL(taskImageInput.files[0]);
    }
});

function addCheckboxListeners(taskElement) {
    const progressBar = taskElement.querySelector('.progress-bar')
    const checkBoxes = taskElement.querySelectorAll('.sub-task-checkbox')

    checkBoxes.forEach(element => {
        element.addEventListener('change', function() {
            updateProgressBar(checkBoxes, progressBar, taskElement)
            saveProgressToLocalStorage(taskElement)
        })
    })

    updateProgressBar(checkBoxes, progressBar, taskElement)
}

function saveProgressToLocalStorage(taskElement) {
    const taskID = parseInt(taskElement.getAttribute('data-id'))
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    const task = tasks.find(t => t.ID === taskID);
    if (task) {
        const checkBoxes = taskElement.querySelectorAll('.sub-task-checkbox')
        task.subTasksStatus = Array.from(checkBoxes).map(checkbox => checkbox.checked)
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        displayTask(task)
        
        const taskElement = document.querySelector(`.square-parent[data-id="${task.ID}"]`)
        if (task.subTasksStatus) {
            const checkBoxes = taskElement.querySelectorAll('.sub-task-checkbox')
            checkBoxes.forEach((checkbox, index) => {
                checkbox.checked = task.subTasksStatus[index] || false
            });
        }

        addCheckboxListeners(taskElement)
    })
})

function displayTask(task){
    const newTaskHTML = `
        <div class="square-parent text-white" data-id="${task.ID}">
            <div class="square-task position-relative">
                <i class="fa-solid fa-trash position-absolute fs-5 btn" onclick="DeleteTask(this.closest('.square-parent'))" id="btn-trash" style="color: #ad3f3f; right:0;"></i>
                <div class="task-img" style="background-image: url('${task.imageUrl}'); background-size: cover; height: 100px;"></div>
                <div class="task-details p-2">
                    <h4 class="mb-0">${task.taskName}</h4>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">progress</p>
                    </div>
                    <div class="progress-details pt-2">
                        <div class="progress position-relative">
                            <div class="progress-bar bg-warning position-relative" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="subTaskbar pt-3">
                        <p class="fs-5 fw-4">Tasks</p>
                        <ul class="list-unstyled sub-task-list">
                            ${task.subTasks.length > 0 ? task.subTasks.map((subtask, index) =>
                                `<li>
                                    <input type="checkbox" class="sub-task-checkbox" ${task.subTasksStatus && task.subTasksStatus[index] ? 'checked' : ''} />
                                    <label>${subtask}</label>
                                </li>`).join("") : '<li><input type="checkbox" class="sub-task-checkbox"/> <label>Done</label></li>'}
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;

    document.getElementById('taskContainer').innerHTML += newTaskHTML;
    const taskElement = document.querySelector(`.square-parent[data-id="${task.ID}"]`)
    addCheckboxListeners(taskElement)
}

function updateProgressBar(checkBoxes, progressBar, taskElements){
    const checkLength = checkBoxes.length
    const CompletedProgress = Array.from(checkBoxes).filter(checkbox => checkbox.checked).length;
    const doneProgress = (CompletedProgress / checkLength) * 100;

    progressBar.style.width = `${doneProgress}%`;
    progressBar.setAttribute('aria-valuenow', doneProgress);

    const toDoContainer = document.getElementById('taskContainer');
    const progressContainer = document.querySelector('.col-md-4:nth-child(2)');
    const doneContainer = document.querySelector('.col-md-4:nth-child(3)');

    if (doneProgress === 0) {
        toDoContainer.appendChild(taskElements);
    } else if (doneProgress > 0 && doneProgress < 100) {
        progressContainer.appendChild(taskElements);
    } else if (doneProgress === 100) {
        doneContainer.appendChild(taskElements);
    }
}


function DeleteTask(taskElement) {
    const taskID = taskElement.getAttribute('data-id');
    taskElement.remove();

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.ID !== parseInt(taskID));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showAddTaskModal() {
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
}








