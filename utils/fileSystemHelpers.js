const fs = require('fs');
const path = require('path');

/**
 * Check the existance of a file or directory
 * @param {string} path - path to a file or path to a directory
 * @returns true is the file or path exist
 */
const checkExistance = async (dirNameOrFileName) => {
  try {
    await fs.promises.access(dirNameOrFileName);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Read all files and directories in the designated directory
 * @param {string} dir - path to the directory
 * @returns array of all file names and direcotry names
 */
const readDir = async (dir) => {
  const filesAndDirs = await fs.promises.readdir(dir);
  return filesAndDirs;
};

/**
 * Generate a formated mdifed time stamp
 * @param {Object} stat - Stat object return by fs.stat
 * @returns String of formated mdifed time stamp
 */
const formatMtime = (stat) => {
  const optionsTime = {
    hour12: false,
  };

  const optionsDate = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  const date = stat.mtime
    .toLocaleDateString('en-US', optionsDate)
    .replace(',', ' ');
  const time = stat.mtime.toLocaleTimeString('en-US', optionsTime);
  const year = stat.mtime.getFullYear();
  return `${date} ${time} ${year}`;
};

/**
 * Generate a formated file size string (B~TiB)
 * @param {Object} stat - Stat object return by fs.stat
 * @returns Formated file size string
 */
const formatFileSize = (stat) => {
  const { size } = stat;
  if (size < 1024) {
    return `${size} B`;
  }
  if (size >= 1024 && size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KiB`;
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MiB`;
  }
  if (size < 1024 * 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GiB`;
  }
  return `${(size / 1024 / 1024 / 1024 / 1024).toFixed(2)} TiB`;
};

/**
 * Get the file and directory information from a specific derectory
 * @param {string} dir - Path to the directory
 * @returns - {directories: [...directory], files: [...file],}
 */
const getDirInfo = async (dir) => {
  if (!(await checkExistance(dir))) {
    return null;
  }

  const dirInfo = {
    directories: [],
    files: [],
  };

  const names = await readDir(dir);

  const nameWithStats = await Promise.all(
    names.map(async (name) => {
      const res = { name, stat: await fs.promises.stat(path.join(dir, name)) };
      return res;
      // eslint-disable-next-line comma-dangle
    })
  );

  nameWithStats.forEach((nameWithStat) => {
    const mtime = formatMtime(nameWithStat.stat);
    if (nameWithStat.stat.isDirectory()) {
      dirInfo.directories.push({ name: nameWithStat.name, mtime });
    } else {
      dirInfo.files.push({
        name: nameWithStat.name,
        mtime,
        size: formatFileSize(nameWithStat.stat),
      });
    }
  });

  return dirInfo;
};

/**
 * Try to create a new folder in directory (dir) with name (name)
 * @param {string} dir - The directory that the new folder will be located
 * @param {string} name - Name of the folder that need to be created
 * @returns - Whether the folder is creatd and message of why it is not created
 */
const createNewFolder = async (dir, name) => {
  const fullPath = path.join(dir, name);
  if (await checkExistance(fullPath)) {
    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory) {
      return { created: false, message: 'Folder name already exist' };
    }
  }

  try {
    await fs.promises.mkdir(fullPath);
    return { created: true, message: 'OK' };
  } catch (e) {
    return { created: false, message: 'System cannot create folder' };
  }
};

/**
 * Try to rename a file or directory
 * @param {string} - The directory that the new folder will be located
 * @param {string} name - The name of the file
 * @param {*} newName - New name of the file
 * @returns - Whether the name is changed and message of why it is not changed
 */
const rename = async (dir, name, newName) => {
  const fullPathOld = path.join(dir, name);
  if (!(await checkExistance(fullPathOld))) {
    return { renamed: false, message: 'Do not exist' };
  }

  const fullPathNew = path.join(dir, newName);
  try {
    await fs.promises.rename(fullPathOld, fullPathNew);
    return { renamed: true, message: 'OK' };
  } catch (e) {
    return { renamed: false, message: 'System cannot do rename' };
  }
};

/**
 * Delete a file or a whole directory
 * @param {string} dir - The direcotry where the file or folder is located
 * @param {*} name - The name of the file or the name of the directory
 * @returns - Whether the file or dir is deleted and message of why it is not deleted
 */
const deleteFileOrDir = async (dir, name) => {
  const fullPath = path.join(dir, name);
  if (!(await checkExistance(fullPath))) {
    return { deleted: false, message: 'Do not exist' };
  }

  const stat = await fs.promises.stat(fullPath);

  if (stat.isDirectory()) {
    try {
      await fs.promises.rm(fullPath, { recursive: true });
      return { deleted: true, message: 'OK' };
    } catch (e) {
      return { deleted: false, message: 'System cannot delete' };
    }
  } else {
    try {
      await fs.promises.unlink(fullPath);
      return { deleted: true, message: 'OK' };
    } catch (e) {
      return { deleted: false, message: 'System cannot delete' };
    }
  }
};

module.exports = {
  checkExistance,
  readDir,
  formatMtime,
  formatFileSize,
  getDirInfo,
  createNewFolder,
  rename,
  deleteFileOrDir,
};
