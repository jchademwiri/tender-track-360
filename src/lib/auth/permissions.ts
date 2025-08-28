import { createAccessControl } from 'better-auth/plugins/access';

const statement = {
  project: ['create', 'share', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({
  project: ['create', 'update', 'delete'],
});
const admin = ac.newRole({
  project: ['create', 'update'],
});
const member = ac.newRole({
  project: ['create'],
});
const manager = ac.newRole({
  project: ['create', 'update'],
});

export { owner, admin, member, manager, ac, statement };
