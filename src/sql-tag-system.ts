import {ConnectionInfo, execute} from "@almaclaine/mysql-utils";

export function makeId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const len = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * len));
    }
    return result;
}

const createTagTable = `
CREATE TABLE IF NOT EXISTS tag (
    id VARCHAR(16) NOT NULL UNIQUE,
    tag VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY(id)
);`;

export async function setupTagSystem(dbInfo: ConnectionInfo) {
    if(!dbInfo.host) throw new Error('Must provide host name');
    if(!dbInfo.password) throw new Error('Must provide password (environment variable recommended)');
    if(!dbInfo.user) throw new Error('Must provide user');

    const database = dbInfo.database || 'sql_tag_system';
    await execute({...dbInfo, database: ''}, `CREATE DATABASE IF NOT EXISTS ${database};`);

    await execute({...dbInfo, database}, createTagTable);
    execute.destroyConnections();
}

export async function tagIdExists(dbInfo: ConnectionInfo, id) {
    const sql = `SELECT id FROM tag WHERE id = ? LIMIT 1;`;
    return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function addTag(dbInfo: ConnectionInfo, tag) {
    const sql = `INSERT INTO tag (id, tag) VALUES (?, ?);`;
    let id = makeId();
    while(await tagIdExists(dbInfo, id)) id = makeId();
    await execute(dbInfo, sql, [id, tag]);
    return id;
}

export async function getTag(dbInfo: ConnectionInfo, id) {
    const sql = `SELECT * FROM tag WHERE id = ? LIMIT 1`;
    return (await execute(dbInfo, sql, [id]))[0][0];
}

export async function listTags(dbInfo: ConnectionInfo, page = 0, limit = 20) {
    const sql = `SELECT * FROM tag LIMIT ? OFFSET ?`;
    const offset = limit * page;
    return (await execute(dbInfo, sql, [limit, offset]))[0];
}
