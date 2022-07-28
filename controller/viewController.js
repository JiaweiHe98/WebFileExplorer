const path = require('path');
const userFileService = require('../service/userFileService');

const landing = (_req, res) => {
  res.render('landing');
};

const fileExplorer = async (req, res) => {
  const dir = req.query.path;

  const previous = path.posix.join(dir, '..');

  const dirInfoRes = await userFileService.getDirInfo(dir);

  if (dirInfoRes.status === 'OK') {
    // for direcotry - get the view is /view/drive?path=
    // for file - download the file is /api/download?file=

    // files: [{name: string, mtime: string, size: string with unit}, {} ...]
    // directories" [{name: string, mtime: string} ...]

    const { dirInfo } = dirInfoRes;
    const { files, directories } = dirInfo;
    const indexOf = dir.split('/').filter((each) => each.length > 0);

    res.render('fileExplorer', {
      files,
      directories,
      indexOf,
      currentDir: dir === '/' ? '' : dir,
      previous,
    });
  } else {
    res.status(404).render('404', { message: 'No such directory' });
  }
};

module.exports = { landing, fileExplorer };
