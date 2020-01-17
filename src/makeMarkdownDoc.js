const fs = require('fs').promises;
const makeMarkdownByFilename = require('./makeMarkdownByFilename');
const mkdirp = require('mkdirp');
const path = require('path');
const R = require('ramda');

const defaultDir = '/doc';

async function makeMarkdownDoc(schema, { outputPath } = {}) {
  return R.pipe(
    R.when(
      R.always(R.isNil(outputPath)),
      R.tap(async () => {
        outputPath = path.parse(require.main.filename).dir + defaultDir;
        await mkdirp(outputPath);
      }),
    ),
    makeMarkdownByFilename,
    R.forEachObjIndexed(async (markdown, filename) => {
      const path = `${outputPath}/${filename}.md`;
      await fs.writeFile(path, markdown, 'utf-8');
      console.log(`Writing file ${path}...`);
    }),
  )(schema);
}

module.exports = makeMarkdownDoc;
