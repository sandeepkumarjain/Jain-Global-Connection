import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  fullName: text('full_name').notNull(),
  surname: text('surname').notNull(),
  email: text('email').notNull(),
  mobile: text('mobile').notNull(),
  role: text('role').default('Member').notNull(),
  status: text('status').default('Approved').notNull(),
  sect: text('sect'),
  city: text('city'),
  state: text('state'),
  country: text('country').default('India'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const businessListings = pgTable('business_listings', {
  id: serial('id').primaryKey(),
  ownerUid: text('owner_uid').notNull(),
  businessName: text('business_name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  gstNumber: text('gst_number'),
  mobile: text('mobile').notNull(),
  email: text('email').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const temples = pgTable('temples', {
  id: serial('id').primaryKey(),
  templeName: text('temple_name').notNull(),
  sect: text('sect').notNull(),
  mainDeity: text('main_deity').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  trustPhone: text('trust_phone'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const matrimonialProfiles = pgTable('matrimonial_profiles', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  fullName: text('full_name').notNull(),
  gender: text('gender').notNull(),
  age: integer('age').notNull(),
  sect: text('sect').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  contactMobile: text('contact_mobile').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businessListings),
  matrimonials: many(matrimonialProfiles),
}));
