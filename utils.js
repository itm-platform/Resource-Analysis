function retrieveTypeOrder(dataset, originalTypes = []) {
    let typeOrder = [];

    function traverse(node, depth = 0) {
        if (!node || typeof node !== 'object' || !node.type) {
            throw new Error("Invalid node or missing type property");
        }

        const { type, children } = node;

        if (typeOrder.length === depth) {
            typeOrder.push(type);
        } else if (typeOrder[depth] !== type) {
            throw new Error(`Structure is not consistent: expected type '${typeOrder[depth]}' but found '${type}' at depth ${depth}`);
        }

        if (children && Array.isArray(children)) {
            children.forEach(child => traverse(child, depth + 1));
        }
    }

    dataset.forEach(root => traverse(root));

    // Convert originalTypes to a Set for efficient look-up
    const originalTypesSet = new Set(originalTypes);

    // Filter the typeOrder based on originalTypes, if it is provided and not empty
    if (originalTypesSet.size > 0) {
        typeOrder = typeOrder.filter(type => originalTypesSet.has(type));
    }

    return typeOrder;
}
function mergeDeep(target, source) {
    Object.keys(source).forEach((key) => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) {
                target[key] = {};
            }
            mergeDeep(target[key], source[key]);
        } else if (Array.isArray(source[key])) {
            // Directly replace the array
            target[key] = source[key].slice();
        } else {
            target[key] = source[key];
        }
    });
};
export { retrieveTypeOrder, mergeDeep };