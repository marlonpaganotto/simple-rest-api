const API_URL = 'http://localhost:3000/notas';

const notaForm = document.getElementById('nota-form');
const notaTexto = document.getElementById('nota-texto');
const notasLista = document.getElementById('notas-lista');


const listarNotas = async () => {
  const response = await fetch(API_URL);
  const notas = await response.json();
  notasLista.innerHTML = '';

  notas.forEach((nota) => {
    
    const li = document.createElement('li');

    
    const textoSpan = document.createElement('span');
    textoSpan.textContent = nota.texto;
    li.appendChild(textoSpan);

    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Deletar';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deletarNota(nota.id);

    
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Atualizar';
    updateBtn.classList.add('update-btn');
    updateBtn.onclick = () => atualizarNota(nota);

    
    li.appendChild(deleteBtn);
    li.appendChild(updateBtn);
    notasLista.appendChild(li);
  });
};


const adicionarNota = async (texto) => {
  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texto }),
  });
  listarNotas();
  notaTexto.value = '';
};


const deletarNota = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  listarNotas();
};


const atualizarNota = async (nota) => {
  const novoTexto = prompt('Digite o novo texto da nota:', nota.texto);
  if (novoTexto) {
    await fetch(`${API_URL}/${nota.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texto: novoTexto }),
    });
    listarNotas();
  }
};


notaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = notaTexto.value;
  if (texto) {
    adicionarNota(texto);
  }
});


listarNotas();
