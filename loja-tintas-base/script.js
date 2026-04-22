// Script para interatividade da loja

// Exemplo: Adicionar ao carrinho
const botoes = document.querySelectorAll('.produto button');

botoes.forEach(botao => {
    botao.addEventListener('click', function() {
        const nomeProduto = this.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        alert(`${nomeProduto} adicionado ao carrinho!`);
    });
});

// Você pode adicionar mais funcionalidades aqui
console.log('Loja de Tintas - JavaScript carregado!');

//carrossel de imagens
const slides = document.querySelectorAll('.slide');
let atual = 0;

function mostrarSlide(index) {
    slides.forEach(slide => slide.classList.remove('ativo'));
    slides[index].classList.add('ativo');
}
//Botões de navegação
const botaoProximo = document.querySelector('.btn-carrossel.proximo');
const botaoAnterior = document.querySelector('.btn-carrossel.anterior');
 
  botaoProximo.addEventListener('click', function() {
      atual = (atual + 1) % slides.length;
      mostrarSlide(atual);
  });

  botaoAnterior.addEventListener('click', function() {
      atual = (atual - 1 + slides.length) % slides.length;
      mostrarSlide(atual);
  });
   //Troca automática a cada 5 segundos
   setInterval(function() {
       atual = (atual + 1) % slides.length;
       mostrarSlide(atual);
   }, 5000);
   const categorias = {
    interior: ['Tintas Plásticas', 'Tintas Acrílicas', 'Primers'],
    exterior: ['Tintas Acrílicas', 'Vernizes', 'Primers Externos'],
    moveis: ['Esmaltes', 'Vernizes', 'Tintas Spray'],
    especial: ['Antimofo', 'Antiferrugem', 'Decorativas'],
    marcas: ['Suvinil', 'Coral', 'Lukscolor'],
    ferramentas: ['Rolos', 'Pincéis', 'Fitas'],
    acessorios: ['Lixas', 'Fitas Crepe', 'Bacias']
};

function abrirSubcategoria(categoria) {
    const coluna2 = document.getElementById('coluna-2');
    const coluna3 = document.getElementById('coluna-3');
    const subcategorias = categorias[categoria] || [];

    coluna2.innerHTML = `
        <button class="btn-voltar" onclick="fecharColuna2()">‹ Voltar</button>
        <h3>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h3>
        <ul class="lista-categorias">
            ${subcategorias.map(sub => `
                <li class="categoria" data-subcategoria="${sub}">
                    ${sub}
                    <span class="seta">›</span>
                </li>
            `).join('')}
        </ul>
    `;

    coluna3.innerHTML = '';
    document.body.classList.remove('col-3-open');
    document.body.classList.add('col-2-open');

    coluna2.querySelectorAll('.categoria[data-subcategoria]').forEach(item => {
        item.addEventListener('click', function() {
            abrirDetalhes(this.dataset.subcategoria);
        });
    });
}
// Função para fechar a coluna 2 e voltar para a visão geral
function fecharColuna2() {
    const coluna2 = document.getElementById('coluna-2');
    const coluna3 = document.getElementById('coluna-3');
    coluna2.innerHTML = '';
    coluna3.innerHTML = '';
    document.body.classList.remove('col-2-open', 'col-3-open');
}

function abrirDetalhes(subcategoria) {
    const coluna3 = document.getElementById('coluna-3');
    coluna3.innerHTML = `
        <button class="btn-voltar" onclick="fecharColuna3()">‹ Voltar</button>
        <h3>${subcategoria}</h3>
        <p>Filtro selecionado: <strong>${subcategoria}</strong></p>
        <button class="btn btn-primary" type="button">Aplicar filtro</button>
    `;

    document.body.classList.remove('col-2-open');
    document.body.classList.add('col-3-open');
}

function fecharColuna3() {
    const coluna3 = document.getElementById('coluna-3');
    coluna3.innerHTML = '';
    document.body.classList.remove('col-3-open');
    document.body.classList.add('col-2-open');
}

document.querySelectorAll('.categoria[data-categoria]').forEach(cat => {
    cat.addEventListener('click', function() {
        abrirSubcategoria(this.dataset.categoria);
    });
});