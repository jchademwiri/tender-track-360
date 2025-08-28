import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  adminAc,
} from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({
  ...defaultStatements,
  project: ['create', 'update', 'delete'],
});
const admin = ac.newRole({
  project: ['create', 'update'],
});
const member = ac.newRole({
  project: ['create'],
});

export { owner, admin, member, ac, statement };
