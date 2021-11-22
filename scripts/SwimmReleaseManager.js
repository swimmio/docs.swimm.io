"use strict"
require('dotenv').config();

class SwimmCacheManager {

    /* Where Should the cache and drafts be written? Neither should be tracked in git. */
    CacheFolder = './.swimmreleases';
    DraftsFolder = `drafts`;
    MetaFolder = `yaml-metadata`;

    /* Locations of nodes in cache */
    ConfigNodes = {
        exported: 'releases.exports.json',
        intermediate: 'releases.imports.json',
        next: 'releases.next.json',
        state: 'releases.state.json',
    }
    YAML = require('yaml');

    constructor (fs) {
        this.fs = fs || require('fs');
    }

    read(node) {
        let path = `${this.CacheFolder}/${node}`;
        if (this.fs.existsSync(path)) {
            return JSON.parse(this.fs.readFileSync(path, 'utf8'));
        }
        return null;
    }

    write(node, value) {
        let path = `${this.CacheFolder}/${node}`;
        this.fs.writeFileSync(path, value);
    }

    writeConfigFile(node, value) {
        this.write(this.ConfigNodes[node], value);
    }

    readConfigFile(node) {
        return this.read(ConfigNodes[node]);
    }

    writeMetaData(node, value) {
        let path = `${this.MetaFolder}/${node}.yml`;
        this.write(path, value);
    }

    readMetaData(node) {
        let path = `${this.CacheFolder}/${this.MetaFolder}/${node}.yml`;
        return this.YAML.parse(this.fs.readFileSync(path, 'utf-8'));
    }

    writeReleaseNote(node, value) {
        let path = `${this.CacheFolder}/${this.DraftsFolder}/${node}`;
        this.fs.mkdirSync(path);
        this.write(`${path}/index.mdx`, value);
    }

    init() {
        /* folders */
        if (! this.fs.existsSync($this.CacheFolder)) {
            this.fs.mkdirSync(this.CacheFolder);
        }

        if (! this.fs.existsSync(`${this.CacheFolder}/${this.DraftsFolder}`)) {
            this.fs.mkdirSync(`${this.CacheFolder}/${this.DraftsFolder}`);
        }
        
        if (! this.fs.existsSync(`${this.CacheFolder}/${this.MetaFolder}`)) {
            this.fs.mkdirSync(`${this.CacheFolder}/${this.MetaFolder}`);
        }

        /* The main (prod) file */
        if (! this.fs.existsSync(this.ProductionReleaseConfig)) {
            this.fs.writeFileSync(this.ProductionReleaseConfig, '{}');
        }

        /* We don't delete any cache from init. In fact, init
         * is a way you can rebuild the whole config from the
         * cache.
         * 
         * But, we need to initialize the configs.
         */

        this.writeConfigFile('exported', '{}');
        this.writeConfigFile('intermediate', '{}');
        this.writeConfigFile('next', '{}');
        this.writeConfigFile('state', '{}');
    }
}

class MiniClickUp {

    constructor(cache, https) {
        this.cache = cache || new SwimmCacheManager;
        this.https = https || require('https');
        console.log('Mini Clickup Instantiated');
    }

    /**
     * @param {String} value
     */
    set route(value) {
        this.route = value;
    }

    async getRequest() {
        return new Promise(async (resolve, reject) => {
            const requestOptions = {
                hostname: 'api.clickup.com',
                port: 443,
                path: this.route,
                method: 'GET',
                headers: {
                    'Authorization': process.env.SwimmReleases_Token    
                }
            };
            let response = [];
            const request = this.https.request(requestOptions, (res) => {
                let state = {
                    remaining: res.headers['x-ratelimit-remaining'],
                    resets: res.headers['x-ratelimit-reset'],
                    ran: Date.now()
                }
                res.on('data', chunk => response.push(chunk));
                res.on('end', () => {
                    this.cache.writeConfigFile('state', state);
                    const data = Buffer.concat(response).toString();
                    resolve(data); 
                });
            });
            request.on('error', e => {
                /* We don't get charged for the request if there's an error response, so no need to update state */
                console.error(e);
                reject(e);
            });
            request.end();
        });
    }
}

class SwimmReleaseManager {
    
    configNodes = {
        changelog: `./changelog`,
        config: `./releases.config.json`,
        version_pattern: /(^[0-9]+['.']+[0-9]+['.']+[0-9]+([a-zA-Z]?))+([\.]?[0-9]?)+([\-?]+[0-9?])?/gm,
    }

    constructor(context) {
        this.releaseContext = context;
        this.cache = new SwimmCacheManager;
        this.config = {
            Production: {},
            Next: {}
        }
    }

    releaseFactory(name) {
        /* Initialize the version nomenclature */
        let keys = ['major', 'minor', 'patch', 'patchlevel'];

        /* Convert any 'micro' release nomenclature to the normalized one, and use a single delimiter. */
        /* There are some old releases like 0.0.3u, which we'd just convert to 0.0.3.1 */
        name.replace(/[a-z]$/g, "\.1").replace('-', '.');
        let values = name.split('.');

        /* Now we have three, possibly four values to match the keys, so merge them. */
        let versionData = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] ? values[index] : null }), {});

        /* Now the metadata */
        let metaData = {
            name: name,
            date: Date.now(),
            security: null,
            blog: null,
            tweet: null, 
            youtube: null,
            linkedin: null
        }

        /* Now we put it all together */
        const backfill = {
            ...versionData,
            ...metaData
        }

        return backfill;
    }

    /* Create a release object in the next config for this release */
    backfillRelease(name) {
        this.config.Next[name] = releaseFactory(name);
    }

    /* Iterate through the clickup workspace dump and import releases along with lists of task lists to query */
    backfillReleases() {

    }

    /* Here we have to manage API requests which is a pain while we get the tasks from all the task lists */
    backfillTasks() {

    }

    /* Write the draft release notes blog posts */
    draftReleaseNotes() {

    }

    /* Writes the config object for a release from cached yaml (written by exportRelease) to the production config. */
    importRelease() {

    }

    /* Write a version object for a given release to the cache as well as stdout (YAML) */
    exportRelease() {

    } 
}

module.exports = { SwimmReleaseManager, SwimmCacheManager }