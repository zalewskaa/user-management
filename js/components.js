// Component functions

// Import libraries
import Chart from 'chart.js/auto';

// Create user card component
export function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';

  const imageSize = 400;
  const placeholderUrl = `https://placehold.co/${imageSize}x${imageSize}/cccccc/666666?text=${encodeURIComponent(
    user.name
  )}`;

  card.innerHTML = `
        <div class="user-image">
            <img src="${placeholderUrl}" alt="${user.name}" width="${imageSize}" height="${imageSize}" loading="eager" />
        </div>
        <div class="user-name">${user.name}</div>
        <div class="user-language">${user.language}</div>
        <div class="user-bio">${user.bio}</div>
        <div class="user-version">Version: ${user.version}</div>
    `;

  return card;
}

// Create loading spinner
export function createLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.innerHTML = `
        <div class="spinner"></div>
        <p>Loading users...</p>
    `;
  return spinner;
}

// Create error message
export function createErrorMessage(message) {
  const error = document.createElement('div');
  error.className = 'error-message';
  error.innerHTML = `
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
    `;
  return error;
}

// Create stats card
export function createStatsCard(title, value, icon) {
  const card = document.createElement('div');
  card.className = 'stats-card';
  card.innerHTML = `
        <div class="stats-icon">${icon}</div>
        <div class="stats-content">
            <h3>${title}</h3>
            <p class="stats-value">${value}</p>
        </div>
    `;
  return card;
}

// Create filter button
export function createFilterButton(text, isActive = false) {
  const button = document.createElement('button');
  button.className = `filter-btn ${isActive ? 'active' : ''}`;
  button.textContent = text;
  return button;
}

// Create search input
export function createSearchInput(placeholder = 'Search users...') {
  const container = document.createElement('div');
  container.className = 'search-container';
  container.innerHTML = `
        <input type="text" class="search-input" placeholder="${placeholder}" />
        <div class="search-icon">🔍</div>
    `;
  return container;
}

// Create pagination
export function createPagination(currentPage, totalPages) {
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pages.push(pageButton);
  }

  pagination.append(...pages);
  return pagination;
}

// Create modal
export function createModal(title, content) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
  return modal;
}

// Create tooltip
export function createTooltip(text, position = 'top') {
  const tooltip = document.createElement('div');
  tooltip.className = `tooltip tooltip-${position}`;
  tooltip.textContent = text;
  return tooltip;
}

// Create notification
export function createNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
  return notification;
}

// Create chart container
export function createChartContainer(id, title) {
  const container = document.createElement('div');
  container.className = 'chart-container';
  container.innerHTML = `
        <h3>${title}</h3>
        <canvas id="${id}"></canvas>
    `;
  return container;
}

// Create data table
export function createDataTable(headers, data) {
  const table = document.createElement('table');
  table.className = 'data-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

// Create progress bar
export function createProgressBar(progress, max = 100) {
  const container = document.createElement('div');
  container.className = 'progress-container';
  container.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${
              (progress / max) * 100
            }%"></div>
        </div>
        <span class="progress-text">${progress}/${max}</span>
    `;
  return container;
}

// Create badge
export function createBadge(text, type = 'default') {
  const badge = document.createElement('span');
  badge.className = `badge badge-${type}`;
  badge.textContent = text;
  return badge;
}

// Create avatar
export function createAvatar(name, size = 40) {
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.style.width = `${size}px`;
  avatar.style.height = `${size}px`;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  avatar.textContent = initials;

  return avatar;
}

// Create dropdown
export function createDropdown(options, selectedValue = null) {
  const select = document.createElement('select');
  select.className = 'dropdown';

  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    if (option.value === selectedValue) {
      optionElement.selected = true;
    }
    select.appendChild(optionElement);
  });

  return select;
}

// Component with event listeners
export function createComplexComponent(data) {
  const container = document.createElement('div');
  container.className = 'complex-component';

  const processedData = data.map((item) => ({
    ...item,
    processed: true,
    timestamp: Date.now(),
    hash: btoa(JSON.stringify(item)),
  }));

  processedData.forEach((item) => {
    const element = document.createElement('div');
    element.className = 'complex-item';
    element.innerHTML = `
            <h4>${item.name}</h4>
            <p>Processed: ${item.processed}</p>
            <p>Timestamp: ${item.timestamp}</p>
            <p>Hash: ${item.hash}</p>
        `;
    container.appendChild(element);
  });

  return container;
}

// Component with event listeners
export function createInteractiveComponent() {
  const component = document.createElement('div');
  component.className = 'interactive-component';
  component.innerHTML = `
        <button class="interactive-btn">Click me</button>
        <div class="interactive-content"></div>
    `;

  const button = component.querySelector('.interactive-btn');
  const content = component.querySelector('.interactive-content');

  button.addEventListener('click', () => {
    content.innerHTML = `<p>Clicked at: ${new Date().toISOString()}</p>`;
  });

  return component;
}

// Component with animations
export function createAnimatedComponent() {
  const component = document.createElement('div');
  component.className = 'animated-component';
  component.innerHTML = `
        <div class="animated-element"></div>
    `;

  const element = component.querySelector('.animated-element');

  setInterval(() => {
    element.style.transform = `rotate(${Math.random() * 360}deg)`;
  }, 100);

  return component;
}
