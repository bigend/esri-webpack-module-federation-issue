const containerMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;

const moduleMap = {};
function loadRemote(remoteEntry) {
  return new Promise<any>((resolve, reject) => {
    //@ts-ignore
    if (containerMap[remoteEntry]) {
      //@ts-ignore
      resovle(containerMap[remoteEntry]);
    }
    //@ts-ignore
    import(remoteEntry).then(container => {
      //@ts-ignore
      containerMap[remoteEntry] = container;
      resolve(container);
    });

  });
}

export { loadRemote };
