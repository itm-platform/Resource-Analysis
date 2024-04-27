// pathResolver.js
import flexiTableConfig from './flexiTable.config.js';

const pathCache = {};

// Checks if an image exists at the given URL and logs appropriately
const imageExists = async (imagePath, imageName) => {
    try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        if (!response.ok) {
            console.log(`Image ${imageName} in host not found, falling back to autonomous file.`);
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Error checking image path ${imagePath}:`, error);
        return false;
    }
};

const preloadIcons = async () => {
    const imageNames = ['Waterfall.svg', 'Agile.svg', 'Service.svg'];
    const paths = imageNames.map(name => ({
        name,
        hostedPath: `${flexiTableConfig.hostedImagePath}/${name}`,
        fallbackPath: `${flexiTableConfig.fallbackImagePath}/${name}`
    }));

    for (const { name, hostedPath, fallbackPath } of paths) {
        const exists = await imageExists(hostedPath, name);
        pathCache[name] = exists ? hostedPath : fallbackPath;
    }
};

const resolveIconPath = (imageName) => {
    return pathCache[imageName] || `${flexiTableConfig.fallbackImagePath}/${imageName}`;
};

export { preloadIcons, resolveIconPath };
