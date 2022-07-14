let token = localStorage.getItem('token');
const apiUrl = 'https://ctd-fe2-todo-v2.herokuapp.com/v1';
const createTaskButtonElement = document.querySelector('#createTaskButton');
const skeletonElement = document.querySelector('#skeleton');
const listTasks = document.querySelector('.tarefas-pendentes');
const completedListTasks = document.querySelector('.tarefas-terminadas');
const completeTaskButtonElement = document.querySelector('.not-done');
const closeAppButtonElement = document.querySelector('#closeApp');
const userName = document.querySelector(' #userName');
const headersAuthRequest = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: token,
};

function getUserInfo() {
  fetch('https://ctd-fe2-todo-v2.herokuapp.com/v1/users/getMe', {
    headers: headersAuthRequest,
  }).then((response) => {
    if (response.ok) {
      response.json().then((user) => {
        userName.innerHTML = '';
        userName.innerHTML += `
        <p>${user.firstName} ${user.lastName}</p>
      `;

        // !Insira a lógica aqui para mostrar o Nome Completo do usuário no HTML da Aplicação
      });
    } else {
      localStorage.clear();
      window.location.href = './../index.html';
    }
  });
}

function updateTask(id, isCompleted, descriptionContent) {
  // Objeto que servira como Configuração da Requisição de POST
  let requestConfiguration = {
    method: 'PUT',
    headers: headersAuthRequest,
    body: JSON.stringify({
      description: descriptionContent,
      completed: !isCompleted,
    }),
  };

  fetch(`${apiUrl}/tasks/${id}`, requestConfiguration).then((response) => {
    if (response.ok) {
      getTasks();
    }
  });
}

function deleteTask(id) {
  let requestConfiguration = {
    method: 'DELETE',
    headers: headersAuthRequest,
  };
  fetch(`${apiUrl}/tasks/${id}`, requestConfiguration).then((response) => {
    if (response.ok) {
      getTasks();
    }
  });
}

function saveTask(id, isCompleted, description) {
  let descriptionValue = document.querySelector(
    `[data-id="${id}"] input`,
  ).value;
  if (descriptionValue == '') {
    updateTask(id, !isCompleted, description);
  } else {
    updateTask(id, !isCompleted, descriptionValue);
  }
}

function editTask(id, description, date, isCompleted) {
  let descriptionElement = document.querySelector(`[data-id="${id}"]`);
  descriptionElement.innerHTML = `
  <input type="text" placeholder="${description}">
  <div class="actions">
    <p class="timestamp">Criada em: ${date}</p>
    <button class="edit" onclick="saveTask(${id},${isCompleted}),'${description}'" >
      <img src="./../assets/circle-check-solid.svg" alt="">
    </button>
  </div>
  `;
}

// Função que Obtem as Tarefas
function getTasks() {
  fetch(`${apiUrl}/tasks`, { headers: headersAuthRequest }).then((response) => {
    response.json().then((tasks) => {
      // Remoção dos itens que estavam antes dentro da Lista inicial
      listTasks.innerHTML = '';
      completedListTasks.innerHTML = '';
      console.log(tasks);
      for (let task of tasks) {
        let date = new Date(task.createdAt);
        let dateFormat = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        if (!task.completed) {
          listTasks.innerHTML += `
        
        <li class="tarefa">
        <div class="not-done" onclick="updateTask(${task.id},${task.completed},'${task.description}')" ></div>
            <div class="descricao" data-id="${task.id}">
              <p class="nome">${task.description}</p>   
              <div class="actions">
                <p class="timestamp">Criada em: ${dateFormat}</p>
                <button class="edit" onclick="editTask(${task.id},'${task.description}','${dateFormat}',${task.completed})" >
                  <img src="./../assets/pen-to-square-solid.svg" alt="">
                </button>
              </div>
            </div>
        </li>
        
        `;
        } else {
          completedListTasks.innerHTML += `
          
          <li class="tarefa">
            <div class="descricao">
              <p class="nome">${task.description}</p>
              <div class="actions">
                <p class="timestamp">Criada em: ${dateFormat}</p>
                <button class="update" onclick="updateTask(${task.id},${task.completed})" >
                  <img src="./../assets/arrow-rotate-left-solid.svg" alt="">
                </button>
                <button class="delete" onclick="deleteTask(${task.id})" >
                <img src="./../assets/trash-can-solid.svg" alt="">
                </button>
              </div>
            </div>
          </li>
          
          `;
        }
      }
    });
  });
}

// Função que Cria uma Task
function createTask() {
  let inputNovaTarefa = document.querySelector('#novaTarefa');
  // Objeto que será enviado para a API
  let data = {
    description: inputNovaTarefa.value,
    completed: false,
  };

  // Objeto que servira como Configuração da Requisição de POST
  let postRequestConfiguration = {
    method: 'POST',
    headers: headersAuthRequest,
    body: JSON.stringify(data),
  };

  fetch(`${apiUrl}/tasks`, postRequestConfiguration).then((response) => {
    if (response.ok) {
      getTasks();
    }
  });
}

function logOut() {
  localStorage.clear();
  window.location.href = './../index.html';
}

completeTaskButtonElement.addEventListener('click', (event) => {
  event.preventDefault();
  completeTask();
});

closeAppButtonElement.addEventListener('click', (event) => {
  event.preventDefault();
  logOut();
});

createTaskButtonElement.addEventListener('click', (event) => {
  event.preventDefault();
  createTask();
});

// Verificação se o Token Existe
if (token === null) {
  // Caso o Token não Exista ele redireciona para o Index
  window.location.href = './../index.html';
} else {
  // Chama a função que obtem os Dados do Usuários
  getUserInfo();

  // Chama a função que obtem as Tarefas
  getTasks();
}
