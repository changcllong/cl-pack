export default function merge(config, env) {
    Object.keys(config[env]).forEach(key => {
        config[key] = config[env][key];
    });
}
