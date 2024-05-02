
import { resolveIconPath, pathCache } from './pathResolver.js';

function renderUserName(params) {
    console.log('renderUserName', params);
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

    const entityType = params.entityType;
    const entitySubType = params.entitySubType;
    const imageName = imageNameMap[entityType]?.[entitySubType] || imageNameMap[entityType];
    const imagePath = resolveIconPath(imageName);
    return `<span class="ftbl-entity-icon"><img src="${imagePath}" alt="${entitySubType || entityType}"></span>${params.name}`;
}
function renderDuration(params) {
    return params.value ? `${params.value / 60} h.` : '';
}
export {
    renderUserName,
    renderEntityName,
    renderDuration
};