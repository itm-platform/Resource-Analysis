
// TODO - 🟢 - Explore injecting the render functions so users can override them or use new ones
import { resolveIconPath, pathCache } from './pathResolver.js';

function renderUserName(params) {
    // TODO - 🟢 - Initials have title, photo doesn't. Either or.
    const imagePath = pathCache[params.id];
    if (imagePath) {
        return `
        <div class="ftbl-user-wrapper">
            <img src="${imagePath}" alt="${params.name}" class="ftbl-user-placeholder"/>
            <span class="ftbl-user-name">${params.name}</span>
        </div>`;
    }
    const initials = params.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    return `
    <div class="ftbl-user-wrapper">
        <div class="ftbl-user-placeholder ftbl-user-initials" title="${params.name}">${initials.toLowerCase()}</div>
        <span class="ftbl-user-name">${params.name}</span>
    </div>`;
}
function renderEntityName(params) {
    const imageNameMap = {
        'project': {
            'waterfall': 'Waterfall.svg',
            'agile': 'Agile.svg'
        },
        'service': 'Service.svg'
    };

    const { entityType, entitySubType } = params;
    let imageName = '';
    
    if (entitySubType && imageNameMap[entityType] && imageNameMap[entityType][entitySubType]) {
        imageName = imageNameMap[entityType][entitySubType];
    } else if (!entitySubType && imageNameMap[entityType] && typeof imageNameMap[entityType] === 'string') {
        imageName = imageNameMap[entityType];
    }

    const imagePath = imageName ? resolveIconPath(imageName) : '';
    return `<span class="ftbl-entity-icon"><img src="${imagePath}" alt="${entitySubType || entityType}"></span>${params.name}`;
}

function renderDuration(params, options={}) {
    return params.value ? `${convertMinutesToHHMM(params.value)}` : '';
}
function convertMinutesToHHMM(minutes) {
    minutes = Number(minutes);
    if (isNaN(minutes)) {
        return '';
    }
    let hours = Math.floor(minutes / 60);  
    let remainingMinutes = minutes % 60;   
    remainingMinutes = remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes;

    return `${hours}:${remainingMinutes}`;
}
export {
    renderUserName,
    renderEntityName,
    renderDuration
};