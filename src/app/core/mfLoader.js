import { __awaiter } from 'tslib';

const containerMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;
function lookupExposedModule(key, exposedModule) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = containerMap[key];
        const factory = yield container.get(exposedModule);
        const Module = factory();
        return Module;
    });
}
function initRemote(container, key) {
    return __awaiter(this, void 0, void 0, function* () {
        // const container = window[key] as Container;
        // Do we still need to initialize the remote?
        if (remoteMap[key]) {
            return container;
        }
        // Do we still need to initialize the share scope?
        if (!isDefaultScopeInitialized) {
            yield __webpack_init_sharing__('default');
            isDefaultScopeInitialized = true;
        }
        yield container.init(__webpack_share_scopes__.default);
        remoteMap[key] = true;
        return container;
    });
}
function loadRemoteEntry(remoteEntryOrOptions, remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof remoteEntryOrOptions === 'string') {
            const remoteEntry = remoteEntryOrOptions;
            return yield loadRemoteScriptEntry(remoteEntry, remoteName);
        }
        else if (remoteEntryOrOptions.type === 'script') {
            const options = remoteEntryOrOptions;
            return yield loadRemoteScriptEntry(options.remoteEntry, options.remoteName);
        }
        else if (remoteEntryOrOptions.type === 'module') {
            const options = remoteEntryOrOptions;
            yield loadRemoteModuleEntry(options.remoteEntry);
        }
    });
}
function loadRemoteModuleEntry(remoteEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (containerMap[remoteEntry]) {
            return Promise.resolve();
        }
        return yield import(/* webpackIgnore:true */ remoteEntry).then(container => {
            initRemote(container, remoteEntry);
            containerMap[remoteEntry] = container;
        });
    });
}
function loadRemoteScriptEntry(remoteEntry, remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Is remoteEntry already loaded?
            if (containerMap[remoteName]) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = remoteEntry;
            script.onerror = reject;
            script.onload = () => {
                const container = window[remoteName];
                initRemote(container, remoteName);
                containerMap[remoteName] = container;
                resolve();
            };
            document.body.appendChild(script);
        });
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadRemoteModule(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let loadRemoteEntryOptions;
        let key;
        // To support legacy API (< ng 13)
        if (!options.type) {
            options.type = 'script';
        }
        if (options.type === 'script') {
            loadRemoteEntryOptions = {
                type: 'script',
                remoteEntry: options.remoteEntry,
                remoteName: options.remoteName
            };
            key = options.remoteName;
        }
        else if (options.type === 'module') {
            loadRemoteEntryOptions = {
                type: 'module',
                remoteEntry: options.remoteEntry,
            };
            key = options.remoteEntry;
        }
        if (options.remoteEntry) {
            yield loadRemoteEntry(loadRemoteEntryOptions);
        }
        return yield lookupExposedModule(key, options.exposedModule);
    });
}

/**
 * Generated bundle index. Do not edit.
 */

export { loadRemoteEntry, loadRemoteModule, lookupExposedModule };
//# sourceMappingURL=angular-architects-module-federation-runtime.js.map