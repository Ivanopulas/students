(() => {

  let array = [];
  let arrayFiltered = []; //по заданию не должно быть манипуляций с основным массивом

  let sortDirFullname = false;
  let sortDirSpec = false;
  let sortDirAge = false;
  let sortDirCourse = false;

  let inputName = document.getElementById('input__name');
  let inputSurname = document.getElementById('input__surname');
  let inputPatron = document.getElementById('input__patron');
  let inputDate = document.getElementById('input__date');
  let inputYear = document.getElementById('input__year');
  let inputSpec = document.getElementById('input__spec');

  let filterName = document.getElementById('filter__name');
  let filterSpec = document.getElementById('filter__spec');
  let filterStart = document.getElementById('filter__start');
  let filterFinish = document.getElementById('filter__finish');

  let timeout = null;

  let firstRow = document.getElementById('first_row');

  function getAge(dayOfBirth) {
    let today = new Date();
    let birthDate = new Date(dayOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function formValidate() {
    let valid = true;
    let errorField = document.getElementById('students__msg');
    let errorMessage = '';

    //проверка поля "имя"
    let firstname = document.getElementById('input__name').value.trim();
    if (firstname === '') {
      valid = false;
      errorMessage = errorMessage + '/ не заполнено поле "Имя" /';
    }

    //проверка поля "фамилия"
    let surname = document.getElementById('input__surname').value.trim();
    if (surname === '') {
      valid = false;
      errorMessage = errorMessage + '/ не заполнено поле "Фамилия" /';
    }

    //проверка поля "отчество"
    let patron = document.getElementById('input__patron').value.trim();
    if (patron === '') {
      valid = false;
      errorMessage = errorMessage + '/ не заполнено поле "Отчество" /';
    }

    //проверка поля "дата рождения"
    let dateInput = document.getElementById('input__date').value;

    if (dateInput === '') {
      valid = false;
      errorMessage = errorMessage + '/ не заполнено поле "Дата рождения" /';
    } else {
      let deadDate = new Date("1900-01-01");
      let date = new Date(dateInput);
      if ((date < deadDate) || (date > (new Date()))) {
        valid = false;
        errorMessage = errorMessage + '/ поле "Дата рождения" - не рождён или мёртв /';
      }
    }

    //проверка поля "год начала обучения"
    let currentYear = (new Date()).getFullYear();
    let year = document.getElementById('input__year').value;
    if (year === '') {
      valid = false;
      errorMessage = errorMessage + '/ не заполнено поле "Год начала обучения" /';
    } else {
      if ((year < 2000) || (year > currentYear)) {
        valid = false;
        errorMessage = errorMessage + '/ "Год начала обучения" д.б. c 2000г. по текущий /';
      }
    }

    //проверка поля "факультет"
    let spec = document.getElementById('input__spec').value.trim();
    if (spec === '') {
      valid = false;
      errorMessage = errorMessage + '/ не заполнено поле "Факультет" /';
    }

    //вывод сообщения об ошибках
    if (valid === true) {
      errorMessage = 'отсутствуют';
      errorField.style.color = 'black';
    } else {
      errorField.style.color = 'salmon';
    }

    errorField.textContent = errorMessage;

    //результат валидации
    return valid;
  }

  function addEntry(array) {

    let item = {};
    item.firstname = inputName.value.trim().toLowerCase();
    item.surname = inputSurname.value.trim().toLowerCase();
    item.patron = inputPatron.value.trim().toLowerCase();
    item.date = inputDate.value;
    item.year = inputYear.value;
    item.spec = inputSpec.value.trim().toLowerCase();
    array.push(item);

    filterCustom(array);

    // очистка инпутов
    inputName.value = null;
    inputSurname.value = null;
    inputPatron.value = null;
    inputDate.value = new Date();
    inputYear.value = null;
    inputSpec.value = null;

    //сброс направлений сортировки
    sortDirFullname = false;
    sortDirSpec = false;
    sortDirAge = false;
    sortDirCourse = false;
  }

  function cleanTable() {
    let rows = document.querySelectorAll('.students__table-row');
    for (let index = 0; index < rows.length; index++) {
      if (rows[index].classList.contains('students__table-row__first') === false) {
        rows[index].remove();
      }
    }
  }

  function writeTable(array) {

    cleanTable();

    for (const item of array) {
      let row = document.createElement('tr');
      firstRow.after(row);
      row.classList.add('students__table-row');

      let tdFullname = document.createElement('td');
      row.append(tdFullname);
      tdFullname.textContent = (item.surname[0].toUpperCase() + item.surname.substring(1)) + ' ' + (item.firstname[0].toUpperCase() + item.firstname.substring(1)) + ' ' + (item.patron[0].toUpperCase() + item.patron.substring(1));
      tdFullname.classList.add('students__table-data');

      let tdSpec = document.createElement('td');
      row.append(tdSpec);
      tdSpec.textContent = item.spec[0].toUpperCase() + item.spec.substring(1);
      tdSpec.classList.add('students__table-data');

      let tdAge = document.createElement('td');
      row.append(tdAge);
      tdAge.textContent = ('0' + (new Date(item.date)).getDate()).slice(-2) + '.' + ('0' + ((new Date(item.date)).getMonth() + 1)).slice(-2) + '.' + (new Date(item.date)).getFullYear() + ' (' + getAge(new Date(item.date)) + ' лет)';
      tdAge.classList.add('students__table-data');

      let tdCourse = document.createElement('td');
      row.append(tdCourse);
      let course = (new Date()).getFullYear() - (item.year);
      let courseMsg = course + ' курс';
      if (course === 4 && (new Date().getMonth()) >= 10 || (course > 4)) {
        courseMsg = 'закончил';
      }
      tdCourse.textContent = item.year + ' - ' + (Number(item.year) + 4) + ' ' + '(' + courseMsg + ')';
      tdCourse.classList.add('students__table-data');
    }
  }

  function compareFullName(a, b) {

    if ((a.surname + ' ' + a.firstname + ' ' + a.patron) > (b.surname + ' ' + b.firstname + ' ' + b.patron)) {
      return 1;
    }
    if ((a.surname + ' ' + a.firstname + ' ' + a.patron) < (b.surname + ' ' + b.firstname + ' ' + b.patron)) {
      return -1;
    }
    return 0;
  }

  function compareSpec(a, b) {
    if (a.spec > b.spec) {
      return 1;
    }
    if (a.spec < b.spec) {
      return -1;
    }
    return 0;
  }

  function compareAge(a, b) {
    if ((getAge(a.date)) > (getAge(b.date))) {
      return 1;
    }
    if ((getAge(a.date)) < (getAge(b.date))) {
      return -1;
    }
    return 0;
  }

  function compareCourse(a, b) {
    if (a.year > b.year) {
      return 1;
    }
    if (a.year < b.year) {
      return -1;
    }
    return 0;
  }

  function filterCustom(array) {

    let finish = String(Number(document.getElementById('filter__finish').value.toLowerCase()) - 4);

    arrayFiltered = array.filter(function (student) {
      return (((student.firstname.includes(filterName.value.toLowerCase())) ||
          (student.surname.includes(filterName.value.toLowerCase())) ||
          (student.patron.includes(filterName.value.toLowerCase())) ||
          (filterName.value === '')
        )

        &&

        (
          (student.spec.includes(String(filterSpec.value.toLowerCase()))) ||
          (filterSpec.value === '')
        )

        &&

        (
          (student.year.includes(filterStart.value.toLowerCase())) ||
          (filterStart.value.length !== 4)

        )

        &&

        (
          (student.year.includes(finish)) ||
          (filterFinish.value.length !== 4)
        )
      );
    })
  }

  document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('add__btn').addEventListener('click', () => {
      if (formValidate()) {
        addEntry(array);
        cleanTable();
        writeTable(arrayFiltered);
      }
    })

    filterName.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        filterCustom(array);
        cleanTable();
        writeTable(arrayFiltered);
      }, 300);
    })

    filterStart.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        filterCustom(array);
        cleanTable();
        writeTable(arrayFiltered);
      }, 300);
    })

    filterFinish.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        filterCustom(array);
        cleanTable();
        writeTable(arrayFiltered);
      }, 300);
    })

    filterSpec.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        filterCustom(array);
        cleanTable();
        writeTable(arrayFiltered);
      }, 300);
    })

    document.getElementById('table__name').addEventListener('click', () => {
      if (sortDirFullname === false) {
        arrayFiltered.sort(compareFullName).reverse();
        sortDirFullname = true;
      } else {
        arrayFiltered.sort(compareFullName);
        sortDirFullname = false;
      }
      cleanTable();
      writeTable(arrayFiltered);
    })

    document.getElementById('table__spec').addEventListener('click', () => {
      if (sortDirSpec === false) {
        arrayFiltered.sort(compareSpec).reverse();
        sortDirSpec = true;
      } else {
        arrayFiltered.sort(compareSpec);
        sortDirSpec = false;
      }
      cleanTable();
      writeTable(arrayFiltered);
    })

    document.getElementById('table__date').addEventListener('click', () => {
      if (sortDirAge === false) {
        arrayFiltered.sort(compareAge).reverse();
        sortDirAge = true;
      } else {
        arrayFiltered.sort(compareAge);
        sortDirAge = false;
      }
      cleanTable();
      writeTable(arrayFiltered);
    })

    document.getElementById('table__course').addEventListener('click', () => {
      if (sortDirCourse === false) {
        arrayFiltered.sort(compareCourse).reverse();
        sortDirCourse = true;
      } else {
        arrayFiltered.sort(compareCourse);
        sortDirCourse = false;
      }
      cleanTable();
      writeTable(arrayFiltered);
    })

  })

})()
