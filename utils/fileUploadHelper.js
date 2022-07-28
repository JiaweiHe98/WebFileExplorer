/**
 * Used to accept a file
 * @param {*} file - File object from express-fileupload
 * @param {*} destination - Destination directory of the file
 * @param {*} callback - Callback function when upload is finished
 */
const acceptUpload = (file, destination, callback) => {
  file.mv(destination, (err) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

module.exports = { acceptUpload };
