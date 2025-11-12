

import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResponse: text('jsonMockResponse').notNull(),
  jobPosition: varchar('jobPosition', { length: 200 }).notNull(),
  jobDesc: varchar('jobDesc', { length: 200 }).notNull(),
  jobExperience: varchar('jobExperience', { length: 200 }).notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(), // Uses a more appropriate type
  mockId: varchar('mockId').notNull()
});


export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question:varchar('question').notNull(),
  correctAns: varchar('correctAns').notNull(),
  userAns: varchar('userAns').notNull(),
  feedback: varchar('feedback').notNull(),
  rating: varchar('rating').notNull(),
  userEmail: varchar('userEmail').notNull(),
  answeredAt: timestamp('answeredAt').notNull().defaultNow(), // Uses a more appropriate type


  })