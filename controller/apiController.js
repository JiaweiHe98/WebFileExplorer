const userFileService = require('../service/userFileService');
const { simpleMessageResponse } = require('../utils/simpleMessageResponse');

/**
 * Used to query the files and folders of a specific directory
 * @param {Object} req - Needed parameter: path (directory)
 * @param {Object} res - Response object
 */
const queryDirectory = async (req, res) => {
  try {
    const { path } = req.query;
    const results = await userFileService.getDirInfo(path);

    if (results.status === 'Do not exist') {
      res.status(404).json({ message: `${path} does not exist!` });
    } else {
      res.status(200).json(results.dirInfo);
    }
  } catch (err) {
    simpleMessageResponse(res, 400, 'Query directory failed!');
  }
};

/**
 * Used to create a folder in specified directory
 * @param {Object} req - Needed parameter: path (directory), name (name of the new folder)
 * @param {Object} res - Response object
 */
const addANewFolder = async (req, res) => {
  try {
    const { path, name } = req.query;

    const results = await userFileService.addANewFolder(path, name);

    if (results.created) {
      simpleMessageResponse(res, 201, `folder named "${name}" is created`);
    } else {
      simpleMessageResponse(res, 400, results.message);
    }
  } catch (err) {
    simpleMessageResponse(res, 400, 'Add new folder failed!');
  }
};

/**
 * Used to rename a folder or file
 * @param {Object} req - Needed parameter: path (directory), name (old name), newname (new name)
 * @param {Object} res - Response object
 */
const rename = async (req, res) => {
  try {
    const { path, name, newname: newName } = req.query;

    const results = await userFileService.rename(path, name, newName);

    if (results.renamed) {
      simpleMessageResponse(
        res,
        200,
        `"${name}" has been changed to "${newName}"`
      );
    } else {
      simpleMessageResponse(res, 400, results.message);
    }
  } catch (err) {
    simpleMessageResponse(res, 400, 'Rename failed!');
  }
};

/**
 * Used to delete a file or a folder
 * @param {Object} req - needed parameters: path (directory), name (old name)
 * @param {Object} res - Response object
 */
const deleteFileOrDir = async (req, res) => {
  try {
    const { path, name } = req.query;

    const results = await userFileService.deleteFileOrDir(path, name);

    if (results.deleted) {
      simpleMessageResponse(res, 200, `"${name}" has been deleted`);
    } else {
      simpleMessageResponse(res, 400, results.message);
    }
  } catch (err) {
    simpleMessageResponse(res, 400, 'Deletion failded');
  }
};

/**
 * Used to handle file upload
 * @param {Object} req - Request, contains path, file name, and file
 * @param {Object} res - Response object
 */
const uploadAFile = (req, res) => {
  try {
    const { path } = req.query;
    const { file } = req.files;
    const { name } = file;

    const callback = (status) => {
      if (status) {
        simpleMessageResponse(res, 201, `File "${name}" successfully uploaded`);
      } else {
        simpleMessageResponse(res, 400, `File "${name}" fail to upload`);
      }
    };

    userFileService.uploadAFile(file, path, name, callback);
  } catch (err) {
    simpleMessageResponse(res, 400, 'Upload file failed!');
  }
};

module.exports = {
  queryDirectory,
  addANewFolder,
  rename,
  deleteFileOrDir,
  uploadAFile,
};
