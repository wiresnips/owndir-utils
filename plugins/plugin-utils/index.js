
const {resolve} = require('path')
const fsp = require('fs/promises')

module.exports = {
  preinstall,
  postinstall,
}

async function exists (path) {
  return fsp.access(path, fs.constants.R_OK).then(() => path).catch(() => null)
}

async function isDir (path) {
  return path && fsp.stat(path).then(dstat => dstat.isDirectory()).catch(err => false);
}

function mkdir (path) {
  return (fsp.stat(path)
    .then(dstat => dstat.isDirectory() || fsp.mkdir(path, {recursive: true}))
    .catch((err) => {
      // console.log('wtf', err)
      return fsp.mkdir(path, {recursive: true})
    })
  )
}

async function preinstall () {
  const installDir = resolve('.')

  const owndir = resolve('.', 'owndir');
  if (!(await isDir(owndir))) {
    console.error(`Could not find directory at ${owdir}. Aborting`);
    process.exit(1);
  }

  const node_modules = resolve('.', 'node_modules')
  if (await isDir(node_modules)) {
    
  }


}


async function copyOver (plugin) {

  const owndir = resolve('.', 'owndir');
  if (!(await isDir(owndir))) {
    console.warn(`Could not find directory at ${owdir}. Plugin ${plugin} not copied.`);
    return;
  }

  const pluginDir = resolve(owndir, 'plugins', plugin)
  await mkdir(pluginDir);
  if (!(await isDir(pluginDir))) {
    console.warn(`Could not establish directory ${pluginDir}. Plugin ${plugin} not copied.`);
    return;
  }  

  const installDir = resolve('.')

}

