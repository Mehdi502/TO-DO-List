let currentTaskId = null; // Stocke l'ID de la tâche en cours de modification

// Affiche ou masque le formulaire d'ajout de tâche
function toggleTaskForm() {
  const form = document.getElementById('task-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Décide d'ajouter ou de modifier une tâche selon l'état de currentTaskId
function addOrUpdateTask() {
  if (currentTaskId) {
    updateTask();
  } else {
    addTask();
  }
}

// Ajoute une nouvelle tâche (requête POST)
function addTask() {
  const task = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    dueDate: document.getElementById('dueDate').value,
    priority: document.getElementById('priority').value,
    progress: document.getElementById('progress').value
  };

  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  .then(response => response.json())
  .then(newTask => {
    displayTask(newTask);
    document.getElementById('task-form').reset();
    toggleTaskForm();
  })
  .catch(error => console.error("Erreur lors de l'ajout de la tâche:", error));
}

// Affiche une tâche dans le tableau
function displayTask(task) {
  const taskList = document.getElementById('task-list');
  const row = document.createElement('tr');
  row.setAttribute('data-task-id', task.id);

  row.innerHTML = `
    <td>${task.title}</td>
    <td>${task.description}</td>
    <td>${task.category}</td>
    <td>${task.dueDate}</td>
    <td class="priority-${task.priority}">${task.priority}</td>
    <td>${task.progress}%</td>
  `;

  // Créez les boutons Modifier et Supprimer
  const actionsCell = document.createElement('td');
  const editButton = document.createElement('button');
  editButton.textContent = 'Modifier';
  editButton.addEventListener('click', () => editTask(task.id));
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Supprimer';
  deleteButton.addEventListener('click', () => deleteTask(task.id));

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);
  row.appendChild(actionsCell);

  taskList.appendChild(row);
}

// Récupère les tâches depuis JSON Server (requête GET)
function fetchTasks() {
  fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => displayTask(task));
    })
    .catch(error => console.error("Erreur lors de la récupération des tâches:", error));
}

// Modifie une tâche
function editTask(id) {
  currentTaskId = id;

  fetch(`http://localhost:3000/tasks/${id}`)
    .then(response => response.json())
    .then(task => {
      document.getElementById('title').value = task.title;
      document.getElementById('description').value = task.description;
      document.getElementById('category').value = task.category;
      document.getElementById('dueDate').value = task.dueDate;
      document.getElementById('priority').value = task.priority;
      document.getElementById('progress').value = task.progress;

      toggleTaskForm();
    })
    .catch(error => console.error('Erreur lors de la récupération de la tâche:', error));
}

// Met à jour une tâche existante (requête PUT)
function updateTask() {
  const updatedTask = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    dueDate: document.getElementById('dueDate').value,
    priority: document.getElementById('priority').value,
    progress: document.getElementById('progress').value
  };

  fetch(`http://localhost:3000/tasks/${currentTaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  })
  .then(response => response.json())
  .then(task => {
    const row = document.querySelector(`tr[data-task-id="${task.id}"]`);
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.category}</td>
      <td>${task.dueDate}</td>
      <td class="priority-${task.priority}">${task.priority}</td>
      <td>${task.progress}%</td>
    `;
    
    const actionsCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.addEventListener('click', () => editTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    currentTaskId = null;
    document.getElementById('task-form').reset();
    toggleTaskForm();
  })
  .catch(error => console.error('Erreur lors de la mise à jour de la tâche:', error));
}

// Supprime une tâche (requête DELETE)
function deleteTask(id) {
  fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    const row = document.querySelector(`tr[data-task-id="${id}"]`);
    if (row) row.remove();
  })
  .catch(error => console.error('Erreur lors de la suppression de la tâche:', error));
}

// Écouteurs d'événements pour charger les tâches et gérer l'ajout/modification
document.addEventListener('DOMContentLoaded', fetchTasks);
document.getElementById('addTaskButton').addEventListener('click', toggleTaskForm);
document.getElementById('submitTaskButton').addEventListener('click', addOrUpdateTask);
