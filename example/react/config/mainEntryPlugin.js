class MainEntryPlugin {
    constructor(path) {
        this.path = path;
    }

    apply(compiler) {
        compiler.hooks.entryOption.tap('MainEntryPlugin', (context, entry) => {
            console.log('MainEntryPlugin', entry);
            if (Array.isArray(entry)) {
                entry.push(this.path);
            } else if (typeof entry === 'object') {
                entry['main-test'] = this.path;
            }
        });
    }
}

module.exports = MainEntryPlugin;
