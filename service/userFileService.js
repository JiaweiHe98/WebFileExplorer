const path = require('path');
const fsHelper = require('../utils/fileSystemHelpers');
const fileUploadHelper = require('../utils/fileUploadHelper');

/**
 * Convert the path from the request to the real path of the computer
 * @param {string} dir - Path from the request
 * @returns - The real path in the computer's file system
 */
const getRealDir = (dir) => {
  try {
    return path.join(__dirname, '../files', dir);
  } catch (err) {
    return path.join(__dirname, '../files');
  }
};

/**
 * Service for geeting the impformation from a directory
 * @param {string} dir - Path from the request
 * @returns - Object of files and directories
 */
const getDirInfo = async (dir) => {
  const res = await fsHelper.getDirInfo(getRealDir(dir));

  if (res) {
    return { status: 'OK', dirInfo: res };
  }

  return { status: 'Do not exist', dirInfo: null };
};

/**
 * Service for adding a folder
 * @param {string} dir - Path from the request
 * @param {string} name - The name of new folder
 * @returns Creation result
 */
const addANewFolder = async (dir, name) => {
  const res = await fsHelper.createNewFolder(getRealDir(dir), name);

  return res;
};

/**
 * Service for rename a file or folder
 * @param {string} dir - Path from the request
 * @param {string} oldName - The old name of the folder or file
 * @param {string} newName - The new name of the folder or file
 * @returns - renaming result
 */
const rename = async (dir, oldName, newName) => {
  const res = await fsHelper.rename(getRealDir(dir), oldName, newName);

  return res;
};

/**
 * Service for delete a file or folder
 * @param {*} dir - Path from the request
 * @param {*} name - The name of the folder or file
 * @returns - Deletion result
 */
const deleteFileOrDir = async (dir, name) => {
  const res = await fsHelper.deleteFileOrDir(getRealDir(dir), name);

  return res;
};

/**
 * Used to handle the file from the client
 * @param {object} file - the file object from express-fileupload
 * @param {string} dir - Path from the request
 * @param {string} name - The name of the file
 * @param {function} callback - Callback function when upload is finished
 */
const uploadAFile = async (file, dir, name, callback) => {
  const isDirectoryExist = await fsHelper.checkExistance(getRealDir(dir));

  if (!isDirectoryExist) {
    callback(false, `Directory "${dir}" does not exist`);
    return;
  }

  const isFileExist = await fsHelper.checkExistance(
    path.join(getRealDir(dir), name),
  );

  if (isFileExist) {
    callback(false, `File "${name}" already exist`);
    return;
  }

  fileUploadHelper.acceptUpload(
    file,
    path.join(getRealDir(dir), name),
    callback
  );
};

/**
 * Used to locate file that the client ask
 * @param {string} pathToFile - Full path in the front end
 * @param {function} callback - A function used to send file to the client or error message
 */
const downloadAFile = async (pathToFile, callback) => {
  const realDir = getRealDir(pathToFile);
  const res = await fsHelper.checkExistance(realDir);
  if (res) {
    callback(true, realDir);
  } else {
    callback(false, null);
  }
};

module.exports = {
  getDirInfo,
  addANewFolder,
  rename,
  deleteFileOrDir,
  uploadAFile,
  downloadAFile,
};
