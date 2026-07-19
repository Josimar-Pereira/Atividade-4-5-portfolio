document.addEventListener('DOMContentLoaded', () => {
    
    const btnSaibaMais = document.getElementById('btn-saiba-mais');
    const areaContato = document.getElementById('area-contato');

    if (btnSaibaMais && areaContato) {
        btnSaibaMais.addEventListener('click', () => {
            areaContato.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const cepInput = document.getElementById('cep');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    cepInput.addEventListener('blur', async () => {
        let cep = cepInput.value.replace(/\D/g, ''); 
        
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                
                if (!data.erro) {
                    cidadeInput.value = data.localidade;
                    estadoInput.value = data.uf;
                } else {
                    alert("CEP não encontrado na base de dados.");
                    cidadeInput.value = '';
                    estadoInput.value = '';
                }
            } catch (error) {
                alert("Erro de conexão ao buscar o CEP.");
            }
        }
    });

    const form = document.getElementById('portfolio-form');
    const feedback = document.getElementById('mensagem-feedback');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const honeypot = document.getElementById('honeypot').value;
        if (honeypot !== "") {
            console.warn("Tentativa de spam bloqueada pelo Honeypot.");
            return;
        }

        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            feedback.textContent = "Por favor, insira um endereço de e-mail válido.";
            feedback.className = "erro";
            return;
        }

        const formData = {
            nome: document.getElementById('nome').value,
            email: email,
            cep: cepInput.value,
            cidade: cidadeInput.value,
            estado: estadoInput.value,
            mensagem: document.getElementById('mensagem').value
        };

        console.log("JSON pronto para envio ao Back-End:", JSON.stringify(formData));

        feedback.textContent = "Obrigado! Sua mensagem foi recebida com sucesso.";
        feedback.className = "sucesso";
        
        form.reset(); 
    });
});