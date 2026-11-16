const buttons = document.querySelectorAll('[data-filter]');
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const empty = document.querySelector('#empty');

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
}

const cards = Array.from(document.querySelectorAll('[data-type]'), (element) => ({
  element,
  type: element.dataset.type,
  name: normalize(element.querySelector('h3').textContent)
}));

let selectedType = 'Todas';

function updateResults() {
  const query = normalize(search.value);
  let visible = 0;

  for (const card of cards) {
    const matchesType = selectedType === 'Todas' || card.type === selectedType;
    const matchesSearch = card.name.includes(query);
    card.element.hidden = !(matchesType && matchesSearch);

    if (!card.element.hidden) {
      visible += 1;
    }
  }

  results.textContent = visible === 1 ? '1 carta' : `${visible} cartas`;
  empty.hidden = visible > 0;
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    selectedType = button.dataset.filter;

    for (const option of buttons) {
      option.setAttribute('aria-pressed', String(option === button));
    }

    updateResults();
  });
}

search.addEventListener('input', updateResults);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error) => {
    console.error('No se pudo registrar el service worker', error);
  });
}