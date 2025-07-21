// Image processing and preloading utilities

/**
 * Preloads images for better performance
 * @param {Array} users - Array of user objects
 */
export function preloadUserImages(users) {
  if (!users || users.length === 0) {
    console.warn('No users available for image preloading');
    return;
  }

  users.forEach((user) => {
    const imageSize = 400;
    const imageUrl = `https://placehold.co/${imageSize}x${imageSize}/cccccc/666666?text=${encodeURIComponent(
      user.name
    )}`;

    // Create preload link element
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);

    // Also preload using Image object for better browser compatibility
    const preloadImg = new Image();
    preloadImg.src = imageUrl;

    preloadImg.addEventListener('load', () => {
      console.log(`Successfully preloaded image for ${user.name}`);
    });

    preloadImg.addEventListener('error', () => {
      console.warn(`Failed to preload image for ${user.name}`);
    });
  });
}

/**
 * Creates additional image requests for testing
 * @param {Array} users - Filtered users array
 */
export function createAdditionalImageRequests(users) {
  const userCards = document.querySelectorAll('.user-card');

  if (userCards.length === 0) {
    console.warn('No user cards found for image requests');
    return;
  }

  // Limit to first 5 users to prevent overwhelming the browser
  const limitedCards = Array.from(userCards).slice(0, 5);

  limitedCards.forEach((card, index) => {
    const user = users[index];
    if (user) {
      const imageContainer = card.querySelector('.user-image');

      if (!imageContainer) {
        console.warn(`No image container found for user ${user.name}`);
        return;
      }

      // Create only 2 additional images instead of 12
      const imageSizes = [200, 300];

      imageSizes.forEach((size) => {
        const hiddenImg = document.createElement('img');
        hiddenImg.style.display = 'none';
        hiddenImg.width = size;
        hiddenImg.height = size;

        const imageUrl = `https://placehold.co/${size}x${size}/cccccc/666666?text=${encodeURIComponent(
          user.name
        )}`;

        hiddenImg.src = imageUrl;
        imageContainer.appendChild(hiddenImg);

        hiddenImg.addEventListener('load', () => {
          console.log(`Hidden ${size}x${size} image loaded for ${user.name}`);
        });

        hiddenImg.addEventListener('error', () => {
          console.error(
            `Failed to load hidden ${size}x${size} image for ${user.name}`
          );
        });
      });
    }
  });
}

/**
 * Processes user images (disabled for external images due to CORS)
 */
export function processUserImages() {
  const imageElements = document.querySelectorAll(
    '.user-image img:first-child'
  );

  if (imageElements.length === 0) {
    console.warn('No images found to process');
    return;
  }

  console.log(
    'Image processing is disabled for external placeholder images due to CORS policy'
  );

  // Instead of processing, just log that images are loaded
  imageElements.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      console.log(`Image loaded successfully: ${img.alt || 'Unknown user'}`);
    }
  });
}
