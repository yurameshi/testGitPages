const createUserButtonElement = document.querySelector('button[type=submit]');

const allInputsElements = document.querySelectorAll('input');

let formData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: false,
};

createUserButtonElement.addEventListener('click', (event) => {
  event.preventDefault();
  if (Object.values(formData).every(Boolean)) {
    createUser();
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Preencha todos os campos corretamente',
    });
  }
});

let checkInputValidity = (input) => {
  if (input.checkValidity()) {
    input.classList.remove('invalid');
    handleFormData(input);
  } else {
    input.classList.add('invalid');
    formData[input.id] = '';
    input.value = input.value.trim();
  }
};
let handleFormData = (input) => {
  formData[input.id] = input.value.trim();
  if (input.id == 'email') {
    input.value = input.value.toLowerCase();
    formData[input.id] = input.value.toLowerCase();
  } else if (input.id == 'password') {
    input.value = input.value.trim();
  } else if (input.id == 'passwordConfirm') {
    if (input.value === formData.password && input.checkValidity()) {
      formData[input.id] = true;
      input.value = input.value.trim();
    } else {
      input.classList.add('invalid');
      formData[input.id] = false;
    }
  }
};
for (let input of allInputsElements) {
  input.addEventListener('keyup', () => {
    checkInputValidity(input);
    console.log(formData);
  });
  input.addEventListener('blur', () => {
    input.value = input.value.trim();
    checkInputValidity(input);
    console.log(formData);
  });
}

let requestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Variavel que irá conter o nosso objeto de configuração da requisição
let requestPostConfiguration = {
  method: 'POST',
  headers: requestHeaders,
};
function createUser() {
  requestPostConfiguration.body = JSON.stringify(formData);
  // O Fetch é responsável por fazer uma requisição para um back-end
  // O parametro do fetch serve justamente para especificarmos aonde ele irá fazer a requisição
  fetch(
    'https://ctd-fe2-todo-v2.herokuapp.com/v1/users',
    requestPostConfiguration,
  ).then((response) => {
    response.json().then((info) => {
      if (response.ok == true) {
        Swal.fire({
          icon: 'success',
          title: 'Parabens! Usuário criado com sucesso.',
        });
        // Simulate a mouse click:
        window.location.href = './../index.html';
      } else {
        if (info === 'El usuario ya se encuentra registrado') {
          alert('O e-mail digitado ja esta cadastrado');
        }
      }
    });
  });
  // window.location.href = './../index.html';
}
