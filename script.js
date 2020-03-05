const PRESENT_URL = 'https://fedyashevvic.host/vista/data/presentList.json';
      QUITING_URL = 'https://fedyashevvic.host/vista/data/quittingList.json';
      SUCCESS_CODE = 200;
      TIMEOUT_LIMIT = 10000;
      MAX_PAGE_WIDTH_PERCENT = 100;
      closeButton = document.querySelector('.info__close-button');
      gragButton = document.querySelector('.tables__item-dragger div');
      infoElement = document.querySelector('.info');
      inputFioElement = document.querySelector('input[name="fio"]');
      inputAgeElement = document.querySelector('input[name="age"]');
      inputDiagnosisElement = document.querySelector('input[name="diagnosis"]');

// Get query
const load = (url, onSuccess, onError, index) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', () => {
      if (xhr.status === SUCCESS_CODE) {
          onSuccess(xhr.response, index);
      } else {
        onError('Сервер недоступен, попробуйте позже!', index);
      }
    });
    xhr.addEventListener('error', () => {
      onError('Ошибка сети, попробуйте позже!', index);
    });
    xhr.addEventListener('timeout', () => {
      onError('Запрос занял слишком много времени!', index);
    });

    xhr.timeout = TIMEOUT_LIMIT;
  xhr.open('GET', url);
  xhr.send();
};
// Обработка ошибки в случае неудачи запроса
const onError = (data, index) => {
  let errorMessage = document.querySelector('#errorMessage').content.querySelector('.tables__error-message').cloneNode(true);
  errorMessage.querySelector('p').textContent = data;
  document.querySelector(`.tables__item_${index}`).appendChild(errorMessage);
};

// заполнение таблиц
const createNewTdElement = textContent => {
  const newTd = document.createElement('td');
  newTd.textContent = textContent;
  return newTd;
};
const createRow = (x, i) => {
  let newTrElement = document.createElement('tr');
      fragment = document.createDocumentFragment();

    fragment.append(createNewTdElement(counter++));
    fragment.append(createNewTdElement(`${x.firstName} ${x.lastName} ${x.patrName}`));
    i == 1 ? fragment.append(createNewTdElement(x.bedNumber)) : fragment.append(createNewTdElement(x.cause));
    newTrElement.appendChild(fragment);
    return newTrElement;
};
const calculateAge = birthDate => {
  let currentDate = new Date();
      birth = new Date(birthDate);
  let age = currentDate.getFullYear() - birth.getFullYear();
  return currentDate.setFullYear(0) < birth.setFullYear(0) ? age - 1 : age;
};
const fillTable = (data, index)  => {
  const presentList = data;
        counter = 1;
        presentTableHeader = document.querySelector(`.tables__nav-item[data-value="tables__item_${index}"] span`);

  presentTableHeader.textContent = `(${presentList.length})`;

  presentList.forEach(x => {
    let newTrElement = createRow(x, index);

    newTrElement.addEventListener('click', evt => {
      let rows = document.querySelectorAll('tr');
      rows.forEach(item => item.classList.remove('tables__item-tr-selected'));
      evt.currentTarget.classList.add('tables__item-tr-selected');

      infoElement.style.border = '2px solid #3298cc'
      inputFioElement.value = `${x.firstName} ${x.lastName} ${x.patrName}`;
      inputAgeElement.value = calculateAge(x.birthDate);
      inputDiagnosisElement.value = x.diagnosis;
    });
    document.querySelector(`.tables__item_${index} tbody`).append(newTrElement);
  });
};
load(PRESENT_URL, fillTable, onError, 1);
load(QUITING_URL, fillTable, onError, 2);

// Переключатель между таблицами
const switchTables = () => {
  const navTabs = document.querySelectorAll('.tables__nav-item');
        tables = document.querySelectorAll('.tables__item');

  function switchHandler() {
    let requiredTable = this.getAttribute('data-value');
    navTabs.forEach(el => {
      el.classList.remove('tables__nav-item-active');
    });
    this.classList.add('tables__nav-item-active');
    getRequiredTable(requiredTable);
  };

  function getRequiredTable(attr) {
    tables.forEach(it => {
      it.classList.contains(attr) ? it.classList.add('tables__item_active') : it.classList.remove('tables__item_active');
    });
  };

  navTabs.forEach(it => {
    it.addEventListener('click', switchHandler);
  });
};
switchTables();

// кнопка для отчистки формы
function emptyInfoHandler() {
  let rows = document.querySelectorAll('tr');
  rows.forEach(item => item.classList.remove('tables__item-tr-selected'));

  infoElement.style.border = '';
  inputFioElement.value = '';
  inputAgeElement.value = '';
  inputDiagnosisElement.value = '';
};
closeButton.addEventListener('click', emptyInfoHandler);

// Изменение ширины таблицы
const tabsWidthHandler = () => {
  function onMouseMove(moveEvt) {
    let shiftPosition = moveEvt.clientX;
        pageWidth = document.querySelector('.page-container').clientWidth;

    function calculatePercent() {
      return shiftPosition/pageWidth * MAX_PAGE_WIDTH_PERCENT;
    };
    document.querySelector('.page-container__child:first-child').style.flexBasis = calculatePercent() + '%';
    document.querySelector('.page-container__child:nth-child(3)').style.flexBasis = MAX_PAGE_WIDTH_PERCENT - calculatePercent() + '%';
  };

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

gragButton.addEventListener('mousedown', tabsWidthHandler);