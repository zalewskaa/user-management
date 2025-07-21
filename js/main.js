// Main application file

// Global variables
let allUsers = [];
let filteredUsers = [];
let currentSort = 'name';
let currentLanguage = 'all';
let currentLimit = 'all';
let searchTerm = '';

// Import libraries
import { format } from 'date-fns';
import { List } from 'immutable';

// DOM queries
const loadingElement = document.getElementById('loading');
const userGridElement = document.getElementById('userGrid');
const searchInputElement = document.getElementById('searchInput');
const languageFilterElement = document.getElementById('languageFilter');
const sortSelectElement = document.getElementById('sortSelect');
const limitSelectElement = document.getElementById('limitSelect');
const totalUsersElement = document.getElementById('totalUsers');
const totalLanguagesElement = document.getElementById('totalLanguages');
const avgVersionElement = document.getElementById('avgVersion');
const loadTimeElement = document.getElementById('loadTime');

// Event listeners
searchInputElement.addEventListener('input', function (e) {
  searchTerm = e.target.value;
  filterAndRenderUsers();
});

sortSelectElement.addEventListener('change', function (e) {
  currentSort = e.target.value;
  filterAndRenderUsers();
});

limitSelectElement.addEventListener('change', function (e) {
  currentLimit = e.target.value;
  filterAndRenderUsers();
});

// Data fetching
async function fetchUsers() {
  const startTime = performance.now();

  try {
    const response = await fetch(
      'https://microsoftedge.github.io/Demos/json-dummy-data/128KB.json'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    allUsers = await response.json();

    filteredUsers = [...allUsers];

    calculateStats();

    renderUsers();
    renderLanguageFilters();

    preloadImages();

    const endTime = performance.now();
    loadTimeElement.textContent = `${Math.round(endTime - startTime)}ms`;

    loadingElement.style.display = 'none';
  } catch (error) {
    console.error('Error fetching users:', error);
    loadingElement.style.display = 'none';
  }
}

// Filtering and sorting
function filterAndRenderUsers() {
  let filtered = [...allUsers];

  if (searchTerm) {
    filtered = filtered.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (currentLanguage !== 'all') {
    filtered = filtered.filter((user) => user.language === currentLanguage);
  }

  filtered.sort((a, b) => {
    switch (currentSort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'language':
        return a.language.localeCompare(b.language);
      case 'version':
        return b.version - a.version;
      default:
        return 0;
    }
  });

  if (currentLimit !== 'all') {
    filtered = filtered.slice(0, parseInt(currentLimit));
  }

  filteredUsers = filtered;
  renderUsers();
}

// Rendering
function renderUsers() {
  userGridElement.innerHTML = '';

  filteredUsers.forEach((user) => {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    const imageSize = 400;
    const placeholderUrl = `https://placehold.co/${imageSize}x${imageSize}/cccccc/666666?text=${encodeURIComponent(
      user.name
    )}`;

    userCard.innerHTML = `
            <div class="user-image">
                <img src="${placeholderUrl}" alt="${user.name}" width="${imageSize}" height="${imageSize}" loading="eager" />
            </div>
            <div class="user-name">${user.name}</div>
            <div class="user-language">${user.language}</div>
            <div class="user-bio">${user.bio}</div>
            <div class="user-version">Version: ${user.version}</div>
        `;

    userGridElement.appendChild(userCard);
  });

  loadUserImages();
}

// Language filter rendering
function renderLanguageFilters() {
  const languages = [...new Set(allUsers.map((user) => user.language))];

  languageFilterElement.innerHTML =
    '<button class="language-btn active" data-language="all">All Languages</button>';

  languages.forEach((language) => {
    const button = document.createElement('button');
    button.className = 'language-btn';
    button.textContent = language;
    button.setAttribute('data-language', language);

    button.addEventListener('click', function () {
      document.querySelectorAll('.language-btn').forEach((btn) => {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      currentLanguage = this.getAttribute('data-language');
      filterAndRenderUsers();
    });

    languageFilterElement.appendChild(button);
  });
}

// Statistics calculation
function calculateStats() {
  const totalUsers = allUsers.length;

  const languages = [...new Set(allUsers.map((user) => user.language))];
  const totalLanguages = languages.length;

  const totalVersion = allUsers.reduce((sum, user) => sum + user.version, 0);
  const avgVersion = totalVersion / totalUsers;

  totalUsersElement.textContent = totalUsers;
  totalLanguagesElement.textContent = totalLanguages;
  avgVersionElement.textContent = avgVersion.toFixed(2);
}

// Image preloading
function preloadImages() {
  allUsers.forEach((user, index) => {
    const imageSizes = [100, 200, 300, 400, 500];

    imageSizes.forEach((size) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';

      const timestamp = Date.now() + index + size;
      const imageUrl = `https://placehold.co/${size}x${size}/cccccc/666666?text=${encodeURIComponent(
        user.name
      )}&preload=true&t=${timestamp}`;

      link.href = imageUrl;

      document.head.appendChild(link);

      const preloadImg = new Image();
      preloadImg.src = imageUrl;

      preloadImg.addEventListener('load', () => {
        console.log(`Preloaded ${size}x${size} image for ${user.name}`);
      });
    });
  });
}

// Multiple image requests
function createMultipleImageRequests() {
  const userCards = document.querySelectorAll('.user-card');

  userCards.forEach((card, index) => {
    const user = filteredUsers[index];
    if (user) {
      const imageContainer = card.querySelector('.user-image');

      const imageSizes = [200, 300, 400, 500];
      const imageFormats = ['jpeg', 'png', 'webp'];

      imageSizes.forEach((size, sizeIndex) => {
        imageFormats.forEach((format, formatIndex) => {
          const hiddenImg = document.createElement('img');
          hiddenImg.style.display = 'none';
          hiddenImg.width = size;
          hiddenImg.height = size;

          const timestamp = Date.now() + sizeIndex + formatIndex;
          const colors = ['aaaaaa', 'bbbbbb', 'cccccc', 'dddddd'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          const imageUrl = `https://placehold.co/${size}x${size}/${randomColor}/666666?text=${encodeURIComponent(
            user.name
          )}&format=${format}&t=${timestamp}`;

          hiddenImg.src = imageUrl;

          imageContainer.appendChild(hiddenImg);

          hiddenImg.addEventListener('load', () => {
            console.log(
              `Hidden ${size}x${size} ${format} image loaded for ${user.name}`
            );
          });
        });
      });
    }
  });
}

// Image processing
function processUserImages() {
  const imageElements = document.querySelectorAll('.user-image img');

  imageElements.forEach((img, index) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;

    img.addEventListener('load', () => {
      ctx.drawImage(img, 0, 0, 400, 400);

      const imageData = ctx.getImageData(0, 0, 400, 400);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * 1.1;
        data[i + 1] = data[i + 1] * 1.05;
        data[i + 2] = data[i + 2] * 1.15;
      }

      ctx.putImageData(imageData, 0, 0);

      const processedImageUrl = canvas.toDataURL('image/jpeg', 0.8);

      img.src = processedImageUrl;
    });
  });
}

// Image loading
function loadUserImages() {
  const imageElements = document.querySelectorAll('.user-image img');

  imageElements.forEach((img, index) => {
    const user = filteredUsers[index];
    if (user) {
      const timestamp = Date.now();
      const imageSize = 400;
      const colors = ['cccccc', 'dddddd', 'eeeeee', 'ffffff'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const textColor = '666666';

      const imageUrl = `https://placehold.co/${imageSize}x${imageSize}/${randomColor}/${textColor}?text=${encodeURIComponent(
        user.name
      )}&t=${timestamp}`;

      img.src = imageUrl;

      img.addEventListener('load', () => {
        console.log(`Image loaded for ${user.name}`);
      });

      img.addEventListener('error', () => {
        console.error(`Failed to load image for ${user.name}`);
      });
    }
  });

  setTimeout(() => {
    processUserImages();
  }, 100);

  setTimeout(() => {
    createMultipleImageRequests();
  }, 200);
}

// App initialization
function initializeApp() {
  loadingElement.style.display = 'block';

  fetchUsers();

  console.log('App initialized');
  console.log('Current timestamp:', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
  console.log('Formatted date:', format(new Date(), 'yyyy-MM-dd'));

  const tempList = List([1, 2, 3, 4, 5]);
  const tempLodashArray = Array.from({ length: 99 }, (_, i) => i + 1);
  const tempRamdaArray = [1, 2, 3, 4, 5];
}

// Global event listeners
window.addEventListener('load', initializeApp);
window.addEventListener('resize', function () {
  console.log('Window resized');
});

window.addEventListener('scroll', function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  console.log('Scroll position:', scrollTop);
});

// Export for testing
export { fetchUsers, filterAndRenderUsers, renderUsers, calculateStats };
