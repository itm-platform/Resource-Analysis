// \Scripts\diContainer.jsdiContainer.js
const diContainer = (function () {
    const _services = {};

    function register(name, service) {
        _services[name] = service;
    }

    function get(name) {
        const service = _services[name];
        if (!service) {
            throw new Error(`Service not found: ${name}`);
        }
        return service;
    }

    function getServices() {
        return _services;
    }

    return { register, get, getServices };
})();

export default diContainer;
