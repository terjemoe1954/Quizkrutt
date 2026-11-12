import {sqliteTable,text,integer,index,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('network_rooms',{
 id:text('id').primaryKey(),code:text('code').notNull(),hostKey:text('host_key').notNull(),guestKey:text('guest_key'),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1),createdAt:integer('created_at').notNull(),inviteUntil:integer('invite_until').notNull(),expiresAt:integer('expires_at').notNull(),
},t=>[uniqueIndex('network_rooms_code_unique').on(t.code),uniqueIndex('network_rooms_host_unique').on(t.hostKey),index('network_rooms_expires').on(t.expiresAt)]);
export const limits=sqliteTable('network_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('network_limits_expires').on(t.expiresAt)]);
