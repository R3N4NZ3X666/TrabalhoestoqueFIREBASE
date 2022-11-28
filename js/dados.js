/**
 * salvar
 * Salva os dados do formulário na collection do Firebase
 * @param {object} event - Evento do objeto que foi clicado
 * @param {string} collection - Nome da collection que será salva no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
    event.preventDefault() // evita que o formulário seja recarregado
    //Verificando os campos obrigatórios
    if (document.getElementById('descricao').value === '') { alert('⚠ É obrigatório informar a descrição do produto!') }
    else if (document.getElementById('quantidade').value === '') { alert('⚠ É obrigatório informar a quantidade do produto!') }
    else if (document.getElementById('data').value === '') { alert('⚠ É obrigatório informar a data de validade!') }
    else if (document.getElementById('valor').value === '') { alert('⚠ É obrigatório informar o valor do produto!') }
    else if (document.getElementById('id').value !== '') {
        alterar(event, collection)
    }

    else { incluir(event, collection) }
}

function incluir(event, collection) {
    event.preventDefault() // evita que o formulário seja recarregado
    //Obtendo os campos do formulário
    const form = document.forms[0]
    const data = new FormData(form)
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries())
    //console.log(`Os dados são:`)
    //console.log(values)
    //O retorno é uma Promise (promessa)
    return firebase.database().ref(collection).push(values)
        .then(() => {
            alert('✔ Registro cadastrado com sucesso!')
            document.getElementById('formCadastro').reset() //limpar o formulário
        })
        .catch(error => {
            console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
            alert(`❌ Falha ao incluir: ${error.message}`)
        })
}

/**
 * obtemDados.
 * Obtém os dados da collection a partir do Firebase.
 * @param {string} collection - Nome da Collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
function obtemDados(collection) {
    var tabela = document.getElementById('tabelaDados')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'table-info'
        cabecalho.insertCell().textContent = 'Descrição'
        cabecalho.insertCell().textContent = 'Unidade'
        cabecalho.insertCell().textContent = 'Quantidade'
        cabecalho.insertCell().textContent = 'Data de validade'
        cabecalho.insertCell().textContent = 'Valor'
        cabecalho.insertCell().textContent = 'Categoria'

        snapshot.forEach(item => {
            //Dados do Firebase
            let db = item.ref.path.pieces_[0] //collection
            let id = item.ref.path.pieces_[1] //id
            let registro = JSON.parse(JSON.stringify(item.val()))
            //Criando as novas linhas na tabela
            let novalinha = tabela.insertRow()
            novalinha.insertCell().textContent = item.val().descricao
            novalinha.insertCell().textContent = new Date(item.val().data).toLocaleDateString()
            novalinha.insertCell().textContent = item.val().unidade
            novalinha.insertCell().textContent = item.val().quantidade
            novalinha.insertCell().textContent = item.val().valor
            novalinha.insertCell().textContent = item.val().categoria
            novalinha.insertCell().innerHTML =
                `
            <button class ='btn btn-danger' title='Remove o registro corrente' onclick=remover('${db}','${id}')>🗑 Excluir </button>
            <button class ='btn btn-warning' title='Edita o registro corrente' onclick=carregaDadosAlteracao('${db}','${id}')>✏ Editar </button>
            `
        })
        let rodape = tabela.insertRow()
        rodape.className = 'table-primary'
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
    })
}

/** 
 * totalRegistros.
 * Retorna a contagem total do número de registros da collection informada
 * @param {string} collection - Nome da Collection no Firebase
 * @return {string} - Texto com o total de registros
* */
function totalRegistros(collection) {
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() === 0) {
            retorno = '‼ Ainda não há nenhum registro cadastrado!'
        } else {
            retorno = `Total de Registros: ${snapshot.numChildren()}`
        }
    })
    return retorno
}

/**

*

*

* @param {String} db

* @param {interger} id

* @return {null}

*/



function remover(db, id) {

    if (window.confirm('!!Confirma a exclusão do registro?')) {

        let dadoExclusao = firebase.database().ref().child(db + '/' + id)

        dadoExclusao.remove()

            .then(() => {

                alert('Registro removido com sucesso!')

            })

            .catch(error => {

                alert('Falha ao excluir: ' + error.message)

            })
    }

}






function carregaDadosAlteracao(db, id) {

    firebase.database().ref(db).on('value', (snapshot) => {

        snapshot.forEach(item => {

            if (item.ref.path.pieces_[1] === id) {

                document.getElementById('id').value = item.ref.path.pieces_[1]

                document.getElementById('descricao').value = item.val().descricao

                document.getElementById('unidade').value = item.val().unidade

                document.getElementById('valor').value = item.val().valor

                document.getElementById('quantidade').value = item.val().quantidade

                document.getElementById('data').value = item.val().data

                document.getElementById('congelados').value = item.val().categoria

                console.log(item.val().categoria)
                if (item.val().categoria === 'Congelados') {

                    document.getElementById('congelados').checked = true

                }
                else if (item.val().categoria === 'Farinácios') {

                    document.getElementById('farinacios').checked = true

                }
                else if (item.val().categoria === 'Perecíveis') {

                    document.getElementById('pereciveis').checked = true

                }
                else if (item.val().categoria === 'Bebidas') {

                    document.getElementById('bebidas').checked = true

                }

                else {


                    document.getElementById('laticinios').checked = true

                }

            }



        })

    })

}





function alterar(event, collection) {
    event.preventDefault()
    //Obtendo os campos do formulário
    const form = document.forms[0];
    const data = new FormData(form);
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries());
    console.log(values)
    //Enviando os dados dos campos para o Firebase
    return firebase.database().ref().child(collection + '/' + values.id).update({
        descricao: values.descricao,
        unidade: values.unidade,
        quantidade: values.quantidade,
        data: values.data,
        valor: values.valor,
        categoria: values.categoria
    })
        .then(() => {
            alert('✅ Registro alterado com sucesso!')
            document.getElementById('formCadastro').reset()
            document.getElementById('id').value = ''
        })
        .catch(error => {
            console.log(error.code)
            console.log(error.message)
            alert('❌ Falha ao alterar: ' + error.message)
        })
}











