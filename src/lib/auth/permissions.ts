import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
} from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({
  ...defaultStatements,
  ...adminAc.statements,
  project: ['create', 'update', 'delete'],
});
const admin = ac.newRole({
  project: ['create', 'update'],
});
const manager = ac.newRole({
  project: ['create'],
});
const member = ac.newRole({
  project: ['create', 'update'],
});

export { owner, admin, manager, member, ac, statement };
