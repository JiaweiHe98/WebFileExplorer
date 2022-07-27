const fs = require('fs');
const path = require('path');
const fsHelper = require('../utils/fileSystemHelpers');

describe('Test function checkExistance', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, '/newFolder'));
    fs.writeFileSync(
      path.join(__dirname, '/newFolder/newFile'),

      'for testing',
    );
  });

  it('An exsiting folder', async () => {
    const res = await fsHelper.checkExistance(
      path.join(__dirname, '/newFolder'),
    );
    expect(res).toBe(true);
  });

  it('non exsiting folder', async () => {
    const res = await fsHelper.checkExistance(
      path.join(__dirname, '/nonExsitingFolder'),
    );
    expect(res).toBe(false);
  });

  it('An exsiting file', async () => {
    const res = await fsHelper.checkExistance(
      path.join(__dirname, '/newFolder', 'newFile'),
    );
    expect(res).toBe(true);
  });
  it('An exsiting file', async () => {
    const res = await fsHelper.checkExistance(
      path.join(__dirname, '/newFolder', 'nonExsitingFile'),
    );
    expect(res).toBe(false);
  });

  afterAll(() => {
    fs.rmSync(path.join(__dirname, '/newFolder'), { recursive: true });
  });
});

describe('Test reading a directory', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, '/newFolder'));
    fs.writeFileSync(path.join(__dirname, '/newFolder/file1'), 'for testing');

    fs.writeFileSync(path.join(__dirname, '/newFolder/file2'), 'for testing');

    fs.writeFileSync(path.join(__dirname, '/newFolder/file3'), 'for testing');
  });

  it('Testing readDir', async () => {
    const res = await fsHelper.readDir(path.join(__dirname, 'newFolder'));
    expect(res).not.toBe(undefined);
    expect(res.length).toBe(3);
  });

  afterAll(() => {
    fs.rmSync(path.join(__dirname, '/newFolder'), { recursive: true });
  });
});

describe('Test formating time', () => {
  it('Test formating modified time', () => {
    const date = new Date(Date.parse('04 Dec 2020 00:12:00 GMT'));
    const statOnlyWithMtime = { mtime: date };
    expect(fsHelper.formatMtime(statOnlyWithMtime)).toBe(
      'Thu Dec 3 19:12:00 2020',
    );
  });
});

describe('Testing formating file size', () => {
  it('100B', () => {
    const stat = { size: 100 };
    expect(fsHelper.formatFileSize(stat)).toBe('100 B');
  });

  it('2KB', () => {
    const stat = { size: 1024 * 2 };
    expect(fsHelper.formatFileSize(stat)).toBe('2.00 KiB');
  });

  it('4MB', () => {
    const stat = { size: 4 * 1024 * 1024 };
    expect(fsHelper.formatFileSize(stat)).toBe('4.00 MiB');
  });

  it('less than 1GB', () => {
    const stat = { size: 1024 * 1024 * 1024 };
    expect(fsHelper.formatFileSize(stat)).toBe('1.00 GiB');
  });

  it('less than 5TB', () => {
    const stat = { size: 5 * 1024 * 1024 * 1024 * 1024 };
    expect(fsHelper.formatFileSize(stat)).toBe('5.00 TiB');
  });

  it('less than 5000TB', () => {
    const stat = { size: 5000 * 1024 * 1024 * 1024 * 1024 };
    expect(fsHelper.formatFileSize(stat)).toBe('5000.00 TiB');
  });
});

describe('test getDirInfo', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, '/newFolder'));
    fs.writeFileSync(path.join(__dirname, '/newFolder/file1'), 'for testing');

    fs.writeFileSync(path.join(__dirname, '/newFolder/file2'), 'for testing');

    fs.writeFileSync(path.join(__dirname, '/newFolder/file3'), 'for testing');

    fs.mkdirSync(path.join(__dirname, '/newFolder/folder'));

    fs.writeFileSync(
      path.join(__dirname, '/newFolder/folder/file4'),
      'for testing',
    );
  });

  it('Non-existing directory', async () => {
    const res = await fsHelper.getDirInfo(
      path.join(__dirname, '/nonExistingFolder'),
    );
    expect(res).toBe(null);
  });

  it('Existing folder', async () => {
    const res = await fsHelper.getDirInfo(path.join(__dirname, '/newFolder'));
    expect(res.directories.length).toBe(1);
    expect(res.files.length).toBe(3);
    expect(res.files[0].name).toBe('file1');
    expect(res.files[1].name).toBe('file2');
    expect(res.files[2].name).toBe('file3');
    expect(res.directories[0].name).toBe('folder');
  });

  afterAll(() => {
    fs.rmSync(path.join(__dirname, '/newFolder'), { recursive: true });
  });
});

describe('Test createNewFolder', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, '/newFolder'));
  });

  it('Create a valid folder', async () => {
    const res = await fsHelper.createNewFolder(
      path.join(__dirname, '/newFolder'),
      'folder',
    );

    expect(res.created).toBe(true);
    expect(res.message).toBe('OK');
  });

  it('Folder already exist', async () => {
    const res = await fsHelper.createNewFolder(
      path.join(__dirname, '/newFolder'),
      'folder',
    );

    expect(res.created).toBe(false);
    expect(res.message).toBe('Folder name already exist');
  });

  it('Invalid folder name', async () => {
    const res = await fsHelper.createNewFolder(
      path.join(__dirname, '/***'),
      'folder',
    );

    expect(res.created).toBe(false);
    expect(res.message).toBe('System cannot create folder');
  });

  afterAll(() => {
    fs.rmSync(path.join(__dirname, '/newFolder'), { recursive: true });
  });
});

describe('Test rename', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, '/newFolder'));
    fs.mkdirSync(path.join(__dirname, '/newFolder/folder1'));
    fs.mkdirSync(path.join(__dirname, '/newFolder/folder2'));
    fs.writeFileSync(path.join(__dirname, '/newFolder/file1'), 'for testing');
    fs.writeFileSync(path.join(__dirname, '/newFolder/file2'), 'for testing');
  });

  it('Non-exsting file', async () => {
    const res = await fsHelper.rename(
      path.join(__dirname, 'newFolder'),
      'someFile',
      'newFileName',
    );
    expect(res.renamed).toBe(false);
    expect(res.message).toBe('Do not exist');
  });

  it('New file name not valid', async () => {
    const res = await fsHelper.rename(
      path.join(__dirname, 'newFolder'),
      'file1',
      'file2',
    );
    expect(res.renamed).toBe(false);
    expect(res.message).toBe('New name already exist');
  });

  it('New folder name not valid', async () => {
    const res = await fsHelper.rename(
      path.join(__dirname, 'newFolder'),
      'folder1',
      'folder2',
    );
    expect(res.renamed).toBe(false);
    expect(res.message).toBe('New name already exist');
  });

  it('New folder name not valid 2', async () => {
    const res = await fsHelper.rename(
      path.join(__dirname, 'newFolder'),
      'folder1',
      'file2',
    );
    expect(res.renamed).toBe(false);
    expect(res.message).toBe('New name already exist');
  });

  it('Valid name', async () => {
    const res = await fsHelper.rename(
      path.join(__dirname, 'newFolder'),
      'file1',
      'file3',
    );
    expect(res.renamed).toBe(true);
    expect(res.message).toBe('OK');

    const newPath = path.join(__dirname, 'newFolder', 'file3');
    expect(() => fs.accessSync(newPath)).not.toThrow();
  });

  it('Invalid new name', async () => {
    const res = await fsHelper.rename(
      path.join(__dirname, 'newFolder'),
      'file3',
      '***',
    );
    expect(res.renamed).toBe(false);
    expect(res.message).toBe('System cannot do rename');
  });

  afterAll(() => {
    fs.rmSync(path.join(__dirname, '/newFolder'), { recursive: true });
  });
});

describe('Test delete', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, '/newFolder'));
    fs.mkdirSync(path.join(__dirname, '/newFolder/folder1'));
    fs.mkdirSync(path.join(__dirname, '/newFolder/folder2'));
    fs.writeFileSync(path.join(__dirname, '/newFolder/file1'), 'for testing');
    fs.writeFileSync(path.join(__dirname, '/newFolder/file2'), 'for testing');
  });

  it('Not exist', async () => {
    const res = await fsHelper.deleteFileOrDir(
      path.join(__dirname, 'newFolder'),
      'someFolder',
    );

    expect(res.deleted).toBe(false);
    expect(res.message).toBe('Do not exist');
  });

  it('delete file1', async () => {
    const res = await fsHelper.deleteFileOrDir(
      path.join(__dirname, 'newFolder'),
      'file1',
    );

    expect(() => {
      fs.accessSync(path.join(__dirname, 'newFolder', 'file1'));
    }).toThrow();

    expect(res.deleted).toBe(true);
    expect(res.message).toBe('OK');
  });

  it('delete folder1', async () => {
    const res = await fsHelper.deleteFileOrDir(
      path.join(__dirname, 'newFolder'),
      'folder1',
    );

    expect(() => {
      fs.accessSync(path.join(__dirname, 'newFolder', 'folder1'));
    }).toThrow();

    expect(res.deleted).toBe(true);
    expect(res.message).toBe('OK');
  });

  afterAll(() => {
    fs.rmSync(path.join(__dirname, '/newFolder'), { recursive: true });
  });
});
