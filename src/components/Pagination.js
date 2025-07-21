// Pagination component

/**
 * Creates a pagination component
 * @param {Object} paginationInfo - Pagination information object
 * @param {Function} onPageChange - Callback function for page changes
 * @returns {HTMLElement} Pagination element
 */
export function createPagination(paginationInfo, onPageChange) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  } = paginationInfo;

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination-container';

  // Pagination info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'pagination-info';
  infoDiv.textContent = `Showing ${startIndex}-${endIndex} of ${totalItems} users`;

  // Pagination controls
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'pagination-controls';

  // First page button
  const firstBtn = createPaginationButton('«', 1, currentPage === 1);
  firstBtn.title = 'First page';
  firstBtn.addEventListener('click', () => onPageChange(1));

  // Previous page button
  const prevBtn = createPaginationButton('‹', currentPage - 1, !hasPrevPage);
  prevBtn.title = 'Previous page';
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));

  // Page number buttons
  const pageButtons = createPageButtons(currentPage, totalPages, onPageChange);

  // Next page button
  const nextBtn = createPaginationButton('›', currentPage + 1, !hasNextPage);
  nextBtn.title = 'Next page';
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));

  // Last page button
  const lastBtn = createPaginationButton(
    '»',
    totalPages,
    currentPage === totalPages
  );
  lastBtn.title = 'Last page';
  lastBtn.addEventListener('click', () => onPageChange(totalPages));

  // Items per page selector
  const itemsPerPageDiv = createItemsPerPageSelector(
    itemsPerPage,
    onPageChange
  );

  // Assemble pagination controls
  controlsDiv.appendChild(firstBtn);
  controlsDiv.appendChild(prevBtn);
  pageButtons.forEach((btn) => controlsDiv.appendChild(btn));
  controlsDiv.appendChild(nextBtn);
  controlsDiv.appendChild(lastBtn);

  // Assemble main container
  paginationDiv.appendChild(infoDiv);
  paginationDiv.appendChild(controlsDiv);
  paginationDiv.appendChild(itemsPerPageDiv);

  return paginationDiv;
}

/**
 * Creates a pagination button
 * @param {string} text - Button text
 * @param {number} page - Page number
 * @param {boolean} disabled - Whether button is disabled
 * @returns {HTMLElement} Button element
 */
function createPaginationButton(text, page, disabled = false) {
  const button = document.createElement('button');
  button.className = `pagination-btn ${disabled ? 'disabled' : ''}`;
  button.textContent = text;
  button.disabled = disabled;
  button.setAttribute('data-page', page);
  return button;
}

/**
 * Creates page number buttons with smart truncation
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Page change callback
 * @returns {Array} Array of button elements
 */
function createPageButtons(currentPage, totalPages, onPageChange) {
  const buttons = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    const firstPageBtn = createPaginationButton('1', 1);
    firstPageBtn.classList.add('page-number');
    firstPageBtn.addEventListener('click', () => onPageChange(1));
    buttons.push(firstPageBtn);

    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      buttons.push(ellipsis);
    }
  }

  // Add page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = createPaginationButton(i.toString(), i);
    pageBtn.classList.add('page-number');
    if (i === currentPage) {
      pageBtn.classList.add('active');
    }
    pageBtn.addEventListener('click', () => onPageChange(i));
    buttons.push(pageBtn);
  }

  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      buttons.push(ellipsis);
    }

    const lastPageBtn = createPaginationButton(
      totalPages.toString(),
      totalPages
    );
    lastPageBtn.classList.add('page-number');
    lastPageBtn.addEventListener('click', () => onPageChange(totalPages));
    buttons.push(lastPageBtn);
  }

  return buttons;
}

/**
 * Creates items per page selector
 * @param {number} currentItemsPerPage - Current items per page
 * @param {Function} onPageChange - Page change callback
 * @returns {HTMLElement} Items per page selector
 */
function createItemsPerPageSelector(currentItemsPerPage, onPageChange) {
  const container = document.createElement('div');
  container.className = 'items-per-page';

  const label = document.createElement('label');
  label.textContent = 'Items per page:';
  label.htmlFor = 'itemsPerPageSelect';

  const select = document.createElement('select');
  select.id = 'itemsPerPageSelect';
  select.className = 'items-per-page-select';

  const options = [10, 25, 50, 100];
  options.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    option.selected = value === currentItemsPerPage;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    onPageChange(1, newItemsPerPage); // Reset to first page with new items per page
  });

  container.appendChild(label);
  container.appendChild(select);

  return container;
}
