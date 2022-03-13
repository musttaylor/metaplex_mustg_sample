import fs from 'fs';
import path from 'path';
import log from 'loglevel';
import { CACHE_PATH } from './constants';

export function cachePath(
  env: string,
  cacheName: string,
  cPath: string = CACHE_PATH,
  legacy: boolean = false,
) {
  log.info('cachePath cPath', cPath);
  log.info('cachePath legacy', legacy);

  const filename = `${env}-${cacheName}`;
  log.info('cachePath filename', filename);

  return path.join(cPath, legacy ? filename : `${filename}.json`);
}

export function loadCache(
  cacheName: string,
  env: string,
  cPath: string = CACHE_PATH,
  legacy: boolean = false,
) {
  const path = cachePath(env, cacheName, cPath, legacy);

  log.info('loadCache path', path);

  if (!fs.existsSync(path)) {

    log.info('loadCache path not exist & legacy - ', legacy);

    if (!legacy) {
      return loadCache(cacheName, env, cPath, true);
    }

    log.info('loadCache undefined');
    return undefined;
  }

  return JSON.parse(fs.readFileSync(path).toString());
}

export function saveCache(
  cacheName: string,
  env: string,
  cacheContent,
  cPath: string = CACHE_PATH,
) {
  cacheContent.env = env;
  cacheContent.cacheName = cacheName;
  fs.writeFileSync(
    cachePath(env, cacheName, cPath),
    JSON.stringify(cacheContent),
  );
}
