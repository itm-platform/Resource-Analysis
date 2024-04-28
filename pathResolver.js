// pathResolver.js
import flexiTableConfig from './flexiTable.config.js';

export const pathCache = {};

const imageExists = async (imagePath, imageName) => {
    try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        if (!response.ok) {
            //console.log(`Image ${imageName} in host not found, falling back to default.`);
            return false;
        }
        return true;
    } catch (error) {
        //console.error(`Error checking image path ${imagePath}:`, error);
        return false;
    }
};

const cacheUserImagePaths = async (users) => {
    for (const user of users) {
        const imageUrl = `${user.imageUrl}`;
        const exists = await imageExists(imageUrl, user.id);
        pathCache[user.id] = exists ? imageUrl : null;  // Caches the path or null if not exists
    }
};
const cacheIconPaths = async () => {
    const iconNames = ['Waterfall.svg', 'Agile.svg', 'Service.svg'];
    const paths = iconNames.map(name => ({
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

export { cacheIconPaths, resolveIconPath, cacheUserImagePaths };
