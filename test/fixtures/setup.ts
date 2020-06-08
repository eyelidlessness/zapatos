import { execSync } from 'child_process';
import { resolve } from 'path';
import { Config, generate } from '../../src/generate';

let isZapatosGenerated = false;

export const init = () => {
  const tmpdb = `zapatos_test_${new Date().toISOString().replace(/\D+/g, '')}`;

  beforeEach(async () => {
    execSync(`createdb ${tmpdb}`);
    execSync(`psql ${tmpdb} < ${process.cwd()}/test-schema.sql`);

    if (!isZapatosGenerated) {
      const zapCfg: Config = {
        db: { connectionString: `postgresql://localhost/${tmpdb}` },
        outDir: resolve(__dirname, '..'),
        srcMode: 'copy',
        schemas: {
          public: {
            include: '*',
            exclude: [
              'geography_columns',
              'geometry_columns',
              'raster_columns',
              'raster_overviews',
              'spatial_ref_sys',
            ],
          },
        },
      };

      await generate(zapCfg);

      isZapatosGenerated = true;
    }
  });

  afterEach(() => {
    execSync(`dropdb ${tmpdb}`);
  });

  return tmpdb;
};
