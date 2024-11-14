// script.js

let currentTaskId = null; // Stocke l'ID de la tâche en cours de modification

// Fonction pour afficher ou masquer le formulaire d'ajout de tâche
function ADDtask() {
  const form = document.getElementById('task-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Fonction d'ajout ou de modification de tâche
function addOrUpdateTask() {
  if (currentTaskId) {
    updateTask(); // Si currentTaskId est défini, mettre à jour la tâche
  } else {
    addTask(); // Sinon, ajouter une nouvelle tâche
  }
}

// Fonction pour ajouter une nouvelle tâche (requête POST)
function addTask() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;
  const progress = document.getElementById('progress').value;

  const task = { title, description, category, dueDate, priority, progress };

  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  .then(response => response.json())
  .then(newTask => {
    console.log("Nouvelle tâche ajoutée :", newTask);
    displayTask(newTask);
    document.getElementById('task-form').reset();
    ADDtask();
  })
  .catch(error => console.error("Erreur lors de l'ajout de la tâche:", error));
}

// Fonction pour afficher une tâche dans le tableau
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
    <td>
      <button onclick="editTask('${task.id}')">Modifier</button>
      <button onclick="deleteTask('${task.id}')">Supprimer</button>
    </td>
  `;

  taskList.appendChild(row);
}

// Fonction pour récupérer les tâches depuis JSON Server (requête GET)
function fetchTasks() {
  fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => displayTask(task));
    })
    .catch(error => console.error("Erreur lors de la récupération des tâches:", error));
}

// Charger les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', fetchTasks);

// Fonction pour éditer une tâche
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

      ADDtask();
    })
    .catch(error => console.error('Erreur lors de la récupération de la tâche:', error));
}

// Fonction pour mettre à jour une tâche existante (requête PUT)
function updateTask() {
  if (!currentTaskId) return;

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
    if (row) {
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.category}</td>
        <td>${task.dueDate}</td>
        <td class="priority-${task.priority}">${task.priority}</td>
        <td>${task.progress}%</td>
        <td>
          <button onclick="editTask('${task.id}')">Modifier</button>
          <button onclick="deleteTask('${task.id}')">Supprimer</button>
        </td>
      `;
    }

    currentTaskId = null;
    document.getElementById('task-form').reset();
    ADDtask();
  })
  .catch(error => console.error('Erreur lors de la mise à jour de la tâche:', error));
}

// Fonction pour supprimer une tâche existante (requête DELETE)
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

// Fonctions de filtrage des tâches
function showAllTasks() {
  const rows = document.querySelectorAll('#task-list tr');
  rows.forEach(row => row.style.display = '');
}

function showCurrentTasks() {
  const rows = document.querySelectorAll('#task-list tr');
  rows.forEach(row => {
    const progress = parseInt(row.querySelector('td:nth-child(6)').textContent);
    row.style.display = progress < 100 ? '' : 'none';
  });
}

function showCompletedTasks() {
  const rows = document.querySelectorAll('#task-list tr');
  rows.forEach(row => {
    const progress = parseInt(row.querySelector('td:nth-child(6)').textContent);
    row.style.display = progress === 100 ? '' : 'none';
  });
}
