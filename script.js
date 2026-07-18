const ctaButton = document.getElementById('cta-button');
ctaButton.addEventListener('click', () => {
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
});

const inputCep = document.getElementById('cep');
const inputCidade = document.getElementById('cidade');

inputCep.addEventListener('blur', async (event) => {
    const cep = event.target.value.replace(/\D/g, '');

    if (cep.length === 8) {
        inputCidade.value = "Buscando...";
        
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                inputCidade.value = "CEP não encontrado";
            } else {
                inputCidade.value = `${dados.localidade} - ${dados.uf}`;
            }
        } catch (erro) {
            inputCidade.value = "Erro na conexão";
            console.error("Erro ao buscar o CEP:", erro);
        }
    } else {
        inputCidade.value = "";
    }
});

function sanitizarInput(texto) {
    const mapaCaracteres = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;'
    };
    return texto.replace(/[&<>"'/]/ig, (match) => mapaCaracteres[match]);
}

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const honeypot = document.getElementById('honeypot').value;
    if (honeypot !== "") {
        console.warn("Tentativa de spam bloqueada.");
        return; 
    }

    const dadosFormulario = {
        nome: sanitizarInput(document.getElementById('nome').value),
        email: sanitizarInput(document.getElementById('email').value),
        servico: sanitizarInput(document.getElementById('servico').value),
        cep: sanitizarInput(document.getElementById('cep').value),
        cidade: sanitizarInput(document.getElementById('cidade').value),
        mensagem: sanitizarInput(document.getElementById('mensagem').value)
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dadosFormulario.email)) {
        alert("Por favor, insira um formato de email válido.");
        return;
    }

    console.log("Dados seguros prontos para envio:", dadosFormulario);
    alert('Mensagem enviada com sucesso! Os dados foram validados e sanitizados no console.');
    e.target.reset(); 
});