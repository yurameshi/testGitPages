const cepInputElement = document.querySelector('#cep')
const cidadeInputElement = document.querySelector('#cidade')
const estadoInputElement = document.querySelector('#estado')
const ruaInputElement = document.querySelector('#rua')

cepInputElement.addEventListener('keyup',

    event => {

        let inputValue = event.target.value

        if(inputValue.length === 8) {

            fetch(`https://viacep.com.br/ws/${inputValue}/json/`).then(

                response => {

                   response.json().then(

                        success => {

                            cidadeInputElement.value = success.localidade
                            estadoInputElement.value = success.uf
                            ruaInputElement.value = success.logradouro

                        }

                   )

                }

            )

        }

    }

)