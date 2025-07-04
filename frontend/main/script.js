const btnTexto = document.getElementById('btnTexto');
const btnArquivo = document.getElementById('btnArquivo');
const areaTexto = document.getElementById('areaTexto');
const areaArquivo = document.getElementById('areaArquivo');
const btnClassificar = document.getElementById('btnClassificar');
const form = document.getElementById('emailForm');
const customFileBtn = document.getElementById('customFileBtn');
const emailFile = document.getElementById('emailFile');
const fileNameSpan = document.getElementById('fileName');

const categoriaEl = document.getElementById('categoria');
const categoriaContainer = categoriaEl.closest('.resultado-item');
const respostaEl = document.getElementById('resposta');
const resultadoDiv = document.getElementById('resultado');

const notification = document.getElementById('notification');
const spinner = document.getElementById('spinner');

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.8.162/build/pdf.worker.min.js';

function showNotification(message, type = 'warning') {
  notification.innerText = message;
  notification.className = `notification ${type}`;
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3500);

  setTimeout(() => {
    notification.classList.remove('hidden');
  }, 10);
}

btnTexto.addEventListener('click', () => {
  areaTexto.classList.remove('hidden');
  areaArquivo.classList.add('hidden');
  btnClassificar.classList.remove('hidden');
});

btnArquivo.addEventListener('click', () => {
  areaTexto.classList.add('hidden');
  areaArquivo.classList.remove('hidden');
  btnClassificar.classList.remove('hidden');
});

customFileBtn.addEventListener('click', () => {
  emailFile.click();
});

emailFile.addEventListener('change', () => {
  const file = emailFile.files[0];

  if (file) {
    const allowedTypes = ['application/pdf', 'text/plain'];

    if (!allowedTypes.includes(file.type)) {
      showNotification(
        'Tipo de arquivo inválido. Apenas .txt ou .pdf são permitidos.',
        'warning'
      );
      emailFile.value = '';
      fileNameSpan.textContent = 'Nenhum arquivo selecionado';
      return;
    }

    fileNameSpan.textContent = file.name;
  } else {
    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const textInput = document.getElementById('emailText').value.trim();
  const file = emailFile.files[0];

  if (!textInput && !file) {
    showNotification(
      'Por favor, insira um texto ou selecione um arquivo.',
      'warning'
    );
    return;
  }

  if (textInput) {
    classifyText(textInput);
  } else if (file) {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        fullText += strings.join(' ') + '\n\n';
      }
      classifyText(fullText);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        classifyText(reader.result);
      };
      reader.readAsText(file);
    }
  }
});

function classifyText(emailText) {
  spinner.classList.remove('hidden');

  fetch('https://autou-ekn4.onrender.com/email/classify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_text: emailText }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Erro na resposta da API');
      return res.json();
    })
    .then((data) => {
      categoriaEl.innerText = data.categoria;
      respostaEl.innerText = data.resposta_sugerida;
      resultadoDiv.classList.remove('hidden');

      categoriaEl.classList.remove(
        'categoria-produtivo',
        'categoria-improdutivo'
      );
      categoriaContainer.classList.remove('produtivo', 'improdutivo');

      const tipo = data.categoria.toLowerCase().trim();
      if (tipo === 'produtivo') {
        categoriaEl.classList.add('categoria-produtivo');
        categoriaContainer.classList.add('produtivo');
        categoriaEl.innerText = '✅ Produtivo';
      } else if (tipo === 'improdutivo') {
        categoriaEl.classList.add('categoria-improdutivo');
        categoriaContainer.classList.add('improdutivo');
        categoriaEl.innerText = '❌ Improdutivo';
      }

      document.getElementById('emailText').value = '';
      emailFile.value = '';
      fileNameSpan.textContent = 'Nenhum arquivo selecionado';

      showNotification('Classificação realizada com sucesso!', 'success');
      spinner.classList.add('hidden');
    })
    .catch((err) => {
      console.error(err);
      showNotification('Erro ao classificar. Verifique a API.', 'warning');
      spinner.classList.add('hidden');
    });
}
