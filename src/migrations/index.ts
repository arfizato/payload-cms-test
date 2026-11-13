import * as migration_20260905_194904_initial from './20260905_194904_initial';
import * as migration_20260906_173444_promote_services_to_collection from './20260906_173444_promote_services_to_collection';
import * as migration_20260906_175641_add_projects from './20260906_175641_add_projects';
import * as migration_20260907_192425_add_footer_global from './20260907_192425_add_footer_global';
import * as migration_20260908_180522_add_site_info from './20260908_180522_add_site_info';
import * as migration_20260908_184129_add_clients from './20260908_184129_add_clients';
import * as migration_20260908_192808_add_project_category from './20260908_192808_add_project_category';
import * as migration_20260908_200907_add_service_gallery from './20260908_200907_add_service_gallery';
import * as migration_20260920_185521_add_roles_and_activity_log from './20260920_185521_add_roles_and_activity_log';
import * as migration_20261111_173819_add_founder_quote from './20261111_173819_add_founder_quote';
import * as migration_20261111_182652_add_certifications from './20261111_182652_add_certifications';

export const migrations = [
  {
    up: migration_20260905_194904_initial.up,
    down: migration_20260905_194904_initial.down,
    name: '20260905_194904_initial',
  },
  {
    up: migration_20260906_173444_promote_services_to_collection.up,
    down: migration_20260906_173444_promote_services_to_collection.down,
    name: '20260906_173444_promote_services_to_collection',
  },
  {
    up: migration_20260906_175641_add_projects.up,
    down: migration_20260906_175641_add_projects.down,
    name: '20260906_175641_add_projects',
  },
  {
    up: migration_20260907_192425_add_footer_global.up,
    down: migration_20260907_192425_add_footer_global.down,
    name: '20260907_192425_add_footer_global',
  },
  {
    up: migration_20260908_180522_add_site_info.up,
    down: migration_20260908_180522_add_site_info.down,
    name: '20260908_180522_add_site_info',
  },
  {
    up: migration_20260908_184129_add_clients.up,
    down: migration_20260908_184129_add_clients.down,
    name: '20260908_184129_add_clients',
  },
  {
    up: migration_20260908_192808_add_project_category.up,
    down: migration_20260908_192808_add_project_category.down,
    name: '20260908_192808_add_project_category',
  },
  {
    up: migration_20260908_200907_add_service_gallery.up,
    down: migration_20260908_200907_add_service_gallery.down,
    name: '20260908_200907_add_service_gallery',
  },
  {
    up: migration_20260920_185521_add_roles_and_activity_log.up,
    down: migration_20260920_185521_add_roles_and_activity_log.down,
    name: '20260920_185521_add_roles_and_activity_log',
  },
  {
    up: migration_20261111_173819_add_founder_quote.up,
    down: migration_20261111_173819_add_founder_quote.down,
    name: '20261111_173819_add_founder_quote',
  },
  {
    up: migration_20261111_182652_add_certifications.up,
    down: migration_20261111_182652_add_certifications.down,
    name: '20261111_182652_add_certifications'
  },
];
