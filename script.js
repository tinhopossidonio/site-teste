// script.js (Versão 14.0 - Pop-up e Botão Corrigidos)
console.log('Script.js loaded - Version 14.0');

// Objeto que mapeia nomes de produtos para os sabores disponíveis.
const saboresDisponiveis = {
  "IGNITE V400 ICE": ["Manga Tropical", "Melancia Gelada", "Menta Forte", "Blueberry Ácido", "Morango Cremoso", "Limão Refrescante", "Cereja Doce"],
  "IGNITE V300 BLACK": ["Menta Refrescante", "Limão Cítrico", "Cereja Doce", "Maçã Verde", "Pêssego Suculento"],
  "OXBAR ICE-NIC 35000": ["Uva Roxa", "Banana Cremosa", "Café Intenso", "Chocolate Amargo", "Baunilha Suave"],
  "IGNITE P100 PRO": ["Morango Silvestre", "Framboesa Azeda", "Manga Madura", "Kiwi Exótico", "Abacaxi Doce"],
  "ELFBAR FS18000 TOUCH": ["Coca-Cola Clássica", "Uva Verde", "Melancia Suculenta", "Guaraná Vibrante", "Laranja Amarga"],
  "IGNITE V80 8000 ROSE GOLD": ["Abacaxi Doce", "Laranja Amarga", "Uva Verde", "Pêssego Fresco", "Menta Gelada"],
  "BITCOIN CRYPTO 20000": ["Baunilha Cremosa", "Menta Gelada", "Blueberry Silvestre", "Caramelo Salgado", "Amêndoa Torrada"],
  "ELFBAR BC10000 Black Gold": ["Manga Exótica", "Limão Siciliano", "Goiaba Tropical", "Maracujá Ácido", "Coco Cremoso"],
  "OXBAR G8000": ["Pêssego Suculento", "Uva Fresca", "Menta Gelada", "Melão Doce", "Cereja Ácida"],
  "FUNKY REPUBLIC Ti7000": ["Blueberry Doce", "Banana Madura", "Cereja Azeda", "Morango Fresco", "Maçã Crocante"]
};

// Variável global para armazenar o produto atualmente selecionado para o modal.
let produtoAtual = {
  nome: "",
  preco: 0,
  quantidade: 0 // Quantidade inicial 0, será determinada pela soma dos sabores
};

/**
 * Exibe uma mensagem de alerta personalizada no ecrã.
 * @param {string} message - A mensagem a ser exibida.
 */
function showAlert(message) {
  const alertBox = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  alertMessage.textContent = message;
  alertBox.classList.add('show');

  setTimeout(() => {
    alertBox.classList.remove('show');
  }, 3000); // A mensagem desaparece após 3 segundos
}

/**
 * Atualiza o subtotal no modal com base nos sabores selecionados.
 */
function updateModalSubtotal() {
  const inputs = document.querySelectorAll("#sabores-form input[type='number']");
  let currentTotalQuantity = 0;
  inputs.forEach(input => {
    currentTotalQuantity += parseInt(input.value) || 0;
  });

  const subtotal = produtoAtual.preco * currentTotalQuantity;
  const subtotalSpan = document.getElementById('modal-subtotal-selecao');
  if (subtotalSpan) {
    subtotalSpan.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  }
  produtoAtual.quantidade = currentTotalQuantity; // Atualiza a quantidade do produto atual
}

/**
 * Abre o modal de seleção de sabores para um produto específico.
 * Popula o formulário do modal com os sabores disponíveis para o produto.
 * @param {HTMLElement} button - O botão "Adicionar ao carrinho" que foi clicado.
 */
function abrirModalComPreco(button) {
  console.log('abrirModalComPreco chamada.');

  const productDiv = button.closest('.produto');
  if (!productDiv) {
    console.error("Elemento .produto pai não encontrado.");
    return;
  }

  // Obtém nome e preço do produto do cartão
  produtoAtual.nome = productDiv.dataset.nome || productDiv.querySelector('h3').innerText.trim();
  produtoAtual.preco = parseFloat(productDiv.dataset.preco) || parseFloat(productDiv.querySelector('p').innerText.replace('R$', '').replace(',', '.').trim());
  produtoAtual.quantidade = 0; // Zera a quantidade ao abrir o modal, será preenchida pelos sabores

  console.log('Produto atual para o modal:', produtoAtual);

  const form = document.getElementById("sabores-form");
  form.innerHTML = ""; // Limpa o formulário de sabores anterior.

  // Atualiza o título do modal com o nome do produto
  document.getElementById("modal-titulo").innerText = produtoAtual.nome || "Produto Desconhecido";
  // Atualiza o preço unitário no modal
  const modalPrecoUnitarioSpan = document.getElementById("modal-preco-unitario");
  if (modalPrecoUnitarioSpan) {
    modalPrecoUnitarioSpan.innerText = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
  }

  const sabores = saboresDisponiveis[produtoAtual.nome];
  if (sabores && sabores.length > 0) {
    form.innerHTML += `
      <p class="text-gray-700 font-bold mb-2">Selecione os Sabores e a Quantidade:</p>
    `;
    sabores.forEach(sabor => {
      form.innerHTML += `
        <label class="flex justify-between items-center mb-2 text-gray-700">
          ${sabor}:
          <input type="number" name="${sabor}" min="0" value="0" class="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 flavor-quantity-input" />
        </label>
      `;
    });
    // Adiciona listeners aos inputs de sabor para atualizar o subtotal
    document.querySelectorAll('.flavor-quantity-input').forEach(input => {
      input.addEventListener('change', updateModalSubtotal);
      input.addEventListener('keyup', updateModalSubtotal);
    });
  } else {
    // Se não houver sabores, exibe uma mensagem e define a quantidade como 1 por padrão
    form.innerHTML = `
      <p class="text-gray-600">Nenhum sabor disponível para este produto. Será adicionado 1 unidade.</p>
    `;
    produtoAtual.quantidade = 1; // Define a quantidade como 1 se não houver sabores
  }

  // Inicializa o subtotal no modal
  updateModalSubtotal();

  document.getElementById("modal").style.display = "flex";
  console.log('Modal exibido.');
}


/**
 * Fecha o modal de seleção de sabores.
 */
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

/**
 * Adiciona o produto com a quantidade e os sabores selecionados ao carrinho.
 * Valida se a soma das quantidades dos sabores corresponde à quantidade total do produto.
 */
function adicionarComSabores() {
  console.log('adicionarComSabores chamada.'); // Log para verificar se a função é chamada
  const inputs = document.querySelectorAll("#sabores-form input[type='number']");
  let saboresSelecionados = {};
  let totalSaboresSelecionados = 0;

  // Se o produto tem sabores configurados, processa-os
  const hasConfiguredFlavors = saboresDisponiveis[produtoAtual.nome] && saboresDisponiveis[produtoAtual.nome].length > 0;

  if (hasConfiguredFlavors) {
    inputs.forEach(input => {
      const qtd = parseInt(input.value);
      if (qtd > 0) {
        saboresSelecionados[input.name] = qtd;
        totalSaboresSelecionados += qtd;
      }
    });

    if (totalSaboresSelecionados === 0) {
      showAlert("Selecione pelo menos 1 sabor.");
      return;
    }
  } else {
    // Se não há sabores configurados, a quantidade é 1 (ou o que for definido por padrão)
    totalSaboresSelecionados = 1; // Se não há sabores, adiciona 1 unidade
    saboresSelecionados = {};
  }

  // Atualiza a quantidade do produtoAtual com a soma dos sabores (ou 1 se não há sabores)
  produtoAtual.quantidade = totalSaboresSelecionados;

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  carrinho.push({
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    quantidade: produtoAtual.quantidade, // Usa a quantidade calculada a partir dos sabores
    sabores: saboresSelecionados
  });

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  console.log('Produto adicionado ao carrinho. Conteúdo atual do carrinho no localStorage (string):', localStorage.getItem('carrinho'));
  console.log('Conteúdo PARSEADO do carrinho no localStorage (objeto):', JSON.parse(localStorage.getItem('carrinho')));
  fecharModal();
  showAlert("Produto adicionado ao carrinho!");
  updateCartCounter();
}


/**
 * Atualiza o contador de itens no carrinho exibido no cabeçalho.
 */
function updateCartCounter() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const contadorElement = document.getElementById('contador');
  if (contadorElement) {
    contadorElement.innerText = carrinho.length;
  }
}

/**
 * Lógica para exibir os itens do carrinho na página carrinho.html.
 * Esta função é executada apenas se a URL atual for 'carrinho.html'.
 */
function loadCartItems() {
  console.log('loadCartItems function called.');
  if (window.location.pathname.includes('carrinho.html')) {
    const itensDiv = document.getElementById('itens');
    const totalDiv = document.getElementById('total');
    
    if (!itensDiv || !totalDiv) {
        console.error("Erro: Elementos 'itens' ou 'total' não encontrados na página do carrinho. Verifique o carrinho.html.");
        return;
    }

    const carrinhoRaw = localStorage.getItem('carrinho');
    console.log('Conteúdo RAW do carrinho lido do localStorage:', carrinhoRaw); 

    let carrinho = [];
    try {
      carrinho = JSON.parse(carrinhoRaw) || [];
    } catch (e) {
      console.error("Erro ao fazer parse do carrinho do localStorage:", e);
      carrinho = [];
    }
    
    console.log('Conteúdo PARSEADO do carrinho lido do localStorage:', carrinho);

    if (carrinho.length === 0) {
      itensDiv.innerHTML = "<p class='text-gray-600'>Seu carrinho está vazio.</p>";
      totalDiv.innerHTML = `<h3 class="text-xl font-bold mt-4">Total: R$ 0,00</h3>`;
    } else {
      let totalGeral = 0;
      let html = '<ul class="list-none p-0">'; // Removido list-disc para melhor controle do layout
      carrinho.forEach((item, index) => {
        const itemTotal = item.preco * item.quantidade;
        totalGeral += itemTotal;

        let saboresHtml = '';
        if (item.sabores && Object.keys(item.sabores).length > 0) {
          saboresHtml = '<div class="text-sm text-gray-600 mt-1">';
          for (let sabor in item.sabores) {
            saboresHtml += `<span>${sabor}: ${item.sabores[sabor]}</span> `;
          }
          saboresHtml += '</div>';
        }

        html += `
          <li class="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
            <div class="flex-grow text-left">
              <strong class="text-lg text-gray-800">${item.nome}</strong> (x${item.quantidade})<br>
              <span class="text-green-600 font-bold">R$ ${item.preco.toFixed(2).replace('.', ',')} / un.</span>
              ${saboresHtml}
            </div>
            <div class="text-right">
              <span class="text-xl font-bold text-gray-900">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </li>
        `;
      });
      html += '</ul>';
      itensDiv.innerHTML = html;
      totalDiv.innerHTML = `<h3 class="text-xl font-bold mt-4">Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}</h3>`;
    }
  }
}

/**
 * Finaliza o pedido e envia os detalhes via WhatsApp.
 */
function finalizarPedido() {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (!nome || !telefone || !endereco || carrinho.length === 0) {
    showAlert('Preencha todos os campos e adicione produtos.');
    return;
  }

  let mensagem = `📦 *Novo Pedido*%0A`;
  mensagem += `👤 Nome: ${nome}%0A📞 Telefone: ${telefone}%0A🏠 Endereço: ${endereco}%0A%0A`;
  mensagem += `🛒 *Produtos:*%0A`;

  let totalGeral = 0;
  carrinho.forEach(item => {
    const itemTotal = item.preco * item.quantidade;
    mensagem += `- ${item.nome} (x${item.quantidade}) - R$ ${itemTotal.toFixed(2).replace('.', ',')}%0A`;
    if (item.sabores && Object.keys(item.sabores).length > 0) {
      for (let sabor in item.sabores) {
        mensagem += `   • ${sabor}: ${item.sabores[sabor]}%0A`;
      }
    }
    totalGeral += itemTotal;
  });

  mensagem += `%0A💰 Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
  const link = `https://wa.me/556999935201?text=${encodeURIComponent(mensagem)}`;

  window.open(link, '_blank');
  localStorage.removeItem('carrinho');
  showAlert("Pedido enviado com sucesso!");
  updateCartCounter();
  loadCartItems();
}

/**
 * Filtra os produtos exibidos com base no texto de pesquisa.
 */
function filterProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const products = document.querySelectorAll('.produto');

  products.forEach(product => {
    const productName = (product.dataset.nome || "").toLowerCase();
    if (productName.includes(searchTerm)) {
      product.style.display = 'flex';
    } else {
      product.style.display = 'none';
    }
  });
}


// Garante que o script é executado depois de todo o DOM ser carregado.
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired.');
  updateCartCounter();
  loadCartItems(); // Esta função será chamada na página do carrinho

  // Adiciona event listeners aos botões "Adicionar ao carrinho" na página inicial.
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  console.log(`Encontrados ${addToCartButtons.length} botões 'Adicionar ao carrinho'.`);
  addToCartButtons.forEach(button => {
    console.log(`Anexando listener ao botão: ${button.closest('.produto').dataset.nome}`);
    button.addEventListener('click', function() {
      abrirModalComPreco(this);
    });
  });

  // Adiciona event listener ao botão "Enviar Pedido via WhatsApp" na página do carrinho.
  const finalizarPedidoBtn = document.getElementById('finalizar-pedido-btn');
  if (finalizarPedidoBtn) {
    finalizarPedidoBtn.addEventListener('click', finalizarPedido);
  }

  // Adiciona event listener ao botão de fechar modal
  const closeModalButton = document.querySelector('#modal .close-button');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', fecharModal);
  }

  // O botão "Adicionar ao Carrinho" dentro do modal agora é tratado dentro de abrirModalComPreco
  // para alternar entre adicionarComSabores e adicionarProdutoDireto.
});
// Evento para adicionar o produto ao carrinho
document.getElementById('adicionar-ao-carrinho').addEventListener('click', function () {
  const checkboxes = document.querySelectorAll('#modalSabores input[type="checkbox"]:checked');
  const saboresSelecionados = Array.from(checkboxes).map(cb => cb.value);

  if (saboresSelecionados.length === 0) {
    showAlert("Por favor, selecione pelo menos um sabor.");
    return;
  }

  produtoAtual.quantidade = saboresSelecionados.length;
  produtoAtual.sabores = saboresSelecionados;

  // Recuperar carrinho existente ou iniciar novo
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(produtoAtual);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  showAlert("Produto adicionado ao carrinho!");

  // Fechar o modal
  document.getElementById("modalSabores").classList.remove("active");
});
