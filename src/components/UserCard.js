// User card component

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
        <div class="user-content">
            <div class="user-name">${user.name}</div>
            <div class="user-language">${user.language}</div>
            <div class="user-bio">${user.bio}</div>
            <div class="user-version">Version: ${user.version}</div>
        </div>
    `;

  return card;
}
