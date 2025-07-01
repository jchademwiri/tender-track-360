import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as activityLogsSchema from './schema/activity-logs';
import * as categoriesSchema from './schema/categories';
import * as clientsSchema from './schema/clients';
import * as documentsSchema from './schema/documents';
import * as enumsSchema from './schema/enums';
import * as notificationsSchema from './schema/notifications';
import * as remindersSchema from './schema/reminders';
import * as statusTransitionsSchema from './schema/status-transitions';
import * as tasksSchema from './schema/tasks';
import * as tenderExtensionsSchema from './schema/tender-extensions';
import * as tendersSchema from './schema/tenders';
import * as usersSchema from './schema/users';

config({ path: '.env.local' });

const client = postgres(process.env.DATABASE_URL!);
const schema = {
  ...activityLogsSchema,
  ...categoriesSchema,
  ...clientsSchema,
  ...documentsSchema,
  ...enumsSchema,
  ...notificationsSchema,
  ...remindersSchema,
  ...statusTransitionsSchema,
  ...tasksSchema,
  ...tenderExtensionsSchema,
  ...tendersSchema,
  ...usersSchema,
};
export const db = drizzle(client, { schema });
