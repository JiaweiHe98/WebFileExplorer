const decoded = decodeURIComponent(window.location.pathname);

console.log(decoded);

const optionsTime = {
  hour12: false,
};

const optionsDate = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};

let recent = JSON.parse(localStorage.getItem('recent'));

if (recent === null) {
  recent = [];
}

// console.log(recent);

const recentLimitRaw = localStorage.getItem('recentLimit');
let recentLimit;

if (recentLimitRaw === null) {
  recentLimit = 5;
} else if (recentLimitRaw === 'all') {
  recentLimit = recent.length;
} else {
  recentLimit = +recentLimitRaw;
}

const renderRecent = () => {
  const selectElement = document.getElementById('recent-limit');
  if (recentLimitRaw === 'all') {
    selectElement.value = 'all';
  } else {
    selectElement.value = recentLimit;
  }

  const tableRecent = document.getElementById('recent-tbody');
  for (let i = 0; i < Math.min(recentLimit, recent.length); i++) {
    const el = recent[i];
    const tr = generateNewTr(el);
    tableRecent.appendChild(tr);
  }
};

const generateNewTr = (el) => {
  const name = document.createElement('td');
  name.classList.add('n');

  const nameATag = document.createElement('a');
  nameATag.innerText = el.name;
  nameATag.href = el.href;

  name.appendChild(nameATag);

  const size = document.createElement('td');
  size.innerText = el.size;
  size.classList.add('s');
  const mtime = document.createElement('td');
  mtime.innerText = el.mtime;
  mtime.classList.add('m');

  const tr = document.createElement('tr');
  tr.appendChild(name);
  tr.appendChild(size);
  tr.appendChild(mtime);
  return tr;
};

renderRecent();

const clearRecent = () => {
  console.log('called');
  localStorage.removeItem('recent');
  clearRecentTrTo(0);
};

const changeRecentLimit = () => {
  const selectElement = document.getElementById('recent-limit');
  const userInputValue = selectElement.value;

  localStorage.setItem('recentLimit', userInputValue);

  const lastLimit = recentLimit;

  // recentLimit is always a number!!!
  if (userInputValue === 'all') {
    recentLimit = recent.length;
  } else {
    recentLimit = +userInputValue;
  }

  // go down last limit >= cur limit
  if (lastLimit >= recentLimit) {
    clearRecentTrTo(recentLimit);
  } else {
    addMoreToRecent(lastLimit, Math.min(recent.length, recentLimit));
  }
};

const addMoreToRecent = (start, end) => {
  const tableRecent = document.getElementById('recent-tbody');
  for (let i = start; i < end; i++) {
    const tr = generateNewTr(recent[i]);
    tableRecent.appendChild(tr);
  }
};

const addToRecent = (isDirectory, name, href, size, mtime) => {
  let idx = -1;
  for (let i = 0; i < recent.length; i++) {
    if (recent[i].href === href) {
      idx = i;
      recent.splice(i, i + 1);
      break;
    }
  }

  const now = new Date();
  const newMtime =
    now.toLocaleDateString('en-US', optionsDate).replace(',', ' ') +
    ' ' +
    now.toLocaleTimeString('en-US', optionsTime) +
    ' ' +
    now.getFullYear();

  let toAdd;
  if (isDirectory) {
    toAdd = { isDirectory: true, name, href, size, mtime: newMtime };
  } else {
    toAdd = { isDirectory: false, name, href, size, mtime: newMtime };
  }

  recent.unshift(toAdd);

  localStorage.setItem('recent', JSON.stringify(recent));

  deleteIthChild(idx);

  const tr = generateNewTr(toAdd);
  const tableRecent = document.getElementById('recent-tbody');
  console.log('after');
  if (recent.length === 0) {
    tableRecent.appendChild(tr);
  } else {
    tableRecent.insertBefore(tr, tableRecent.children[1]);
  }
};

const clearRecentTrTo = (remaining) => {
  const tableRecent = document.getElementById('recent-tbody');
  while (tableRecent.children.length > remaining + 1) {
    tableRecent.removeChild(tableRecent.lastChild);
  }
};

const deleteIthChild = (idx) => {
  const tableRecent = document.getElementById('recent-tbody');
  if (idx >= 0 && idx < tableRecent.children.length) {
    tableRecent.removeChild(tableRecent.children[idx]);
  }
};

const uploadFile = (dir) => {
  const fileInput = document.getElementById('file-upload');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('path', dir);

  fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
};
