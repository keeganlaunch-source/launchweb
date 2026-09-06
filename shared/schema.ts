import { pgTable, text, serial, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  country: text("country"),
  city: text("city"),
  region: text("region"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  country: text("country"),
  city: text("city"),
  region: text("region"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(), // Can be email or unique identifier
  email: text("email").notNull(),
  subscriptionStatus: text("subscription_status").notNull().default("subscribed"), // subscribed, unsubscribed, paused
  country: text("country"),
  city: text("city"),
  region: text("region"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consultationDraw = pgTable("consultation_draw", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  country: text("country"),
  city: text("city"),
  region: text("region"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  drawEndDate: date("draw_end_date").notNull(), // Dynamic end of month
  isWinner: text("is_winner").default("pending"), // pending, winner, not_selected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userStreaks = pgTable("user_streaks", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  totalWorkouts: integer("total_workouts").default(0).notNull(),
  lastWorkoutDate: date("last_workout_date"),
  streakLevel: integer("streak_level").default(1).notNull(),
  achievements: text("achievements").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiChatSessions = pgTable("ai_chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userQuestion: text("user_question").notNull(),
  aiResponse: text("ai_response").notNull(),
  questionCategory: text("question_category"), // fitness, nutrition, motivation, etc.
  responseTime: integer("response_time"), // milliseconds
  userRating: integer("user_rating"), // 1-5 stars if provided
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
  region: text("region"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(), // 'page_view', 'app_download', 'play_store_click', 'social_click', 'conversion'
  eventData: text("event_data"), // JSON string for additional data
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  socialPlatform: text("social_platform"), // 'facebook', 'instagram', 'tiktok', 'whatsapp', 'youtube'
  country: text("country"),
  city: text("city"),
  region: text("region"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  subscriptionType: text("subscription_type").notNull(), // "free", "premium", "pro"
  subscriptionStatus: text("subscription_status").notNull(), // "active", "canceled", "expired", "trial"
  subscriptionStartDate: timestamp("subscription_start_date").notNull(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  lastActiveDate: timestamp("last_active_date"),
  platform: text("platform"), // "ios", "android", "web"
  sourceAttribution: text("source_attribution"), // Track where they came from
  monthlyRevenue: text("monthly_revenue"), // Store as text to avoid numeric type issues
  totalRevenue: text("total_revenue"),
  churnDate: timestamp("churn_date"),
  reactivationDate: timestamp("reactivation_date"),
  country: text("country"),
  city: text("city"),
  region: text("region"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriberActivity = pgTable("subscriber_activity", {
  id: serial("id").primaryKey(),
  subscriberId: integer("subscriber_id").references(() => subscribers.id).notNull(),
  activityType: text("activity_type").notNull(), // "login", "workout", "content_view", "feature_use"
  activityData: text("activity_data"),
  platform: text("platform"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSignupSchema = createInsertSchema(newsletterSignups).omit({
  id: true,
  createdAt: true,
});

export const insertUserStreakSchema = createInsertSchema(userStreaks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  userId: true,
  email: true,
  subscriptionType: true,
  subscriptionStatus: true,
  subscriptionStartDate: true,
  subscriptionEndDate: true,
  lastActiveDate: true,
  platform: true,
  sourceAttribution: true,
  monthlyRevenue: true,
  totalRevenue: true,
  churnDate: true,
  reactivationDate: true,
  country: true,
  city: true,
  region: true,
});

export const insertSubscriberActivitySchema = createInsertSchema(subscriberActivity).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertNewsletterSignup = z.infer<typeof insertNewsletterSignupSchema>;
export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type UserStreak = typeof userStreaks.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriberActivity = z.infer<typeof insertSubscriberActivitySchema>;
export type SubscriberActivity = typeof subscriberActivity.$inferSelect;

export const insertAiChatSessionSchema = createInsertSchema(aiChatSessions).omit({
  id: true,
  createdAt: true,
});

export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type InsertAiChatSession = z.infer<typeof insertAiChatSessionSchema>;

export const insertConsultationDrawSchema = createInsertSchema(consultationDraw).omit({
  id: true,
  createdAt: true,
});

export type ConsultationDraw = typeof consultationDraw.$inferSelect;
export type InsertConsultationDraw = z.infer<typeof insertConsultationDrawSchema>;

// PDF Products System
export const pdfProducts = pgTable("pdf_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  filename: text("filename").notNull(), // PDF filename
  priceUsd: integer("price_usd").notNull().default(1000), // Price in cents ($10.00)
  isActive: text("is_active").notNull().default("true"),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pdfPurchases = pgTable("pdf_purchases", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => pdfProducts.id).notNull(),
  customerEmail: text("customer_email").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  amountPaid: integer("amount_paid").notNull(), // Amount in cents
  currency: text("currency").notNull().default("usd"),
  customerCountry: text("customer_country"),
  customerCity: text("customer_city"),
  customerRegion: text("customer_region"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  downloadToken: text("download_token").notNull().unique(), // Secure download token
  downloadedAt: timestamp("downloaded_at"),
  downloadExpiry: timestamp("download_expiry").notNull(), // 24 hours from purchase
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPdfProductSchema = createInsertSchema(pdfProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPdfPurchaseSchema = createInsertSchema(pdfPurchases).omit({
  id: true,
  createdAt: true,
});

export type PdfProduct = typeof pdfProducts.$inferSelect;
export type InsertPdfProduct = z.infer<typeof insertPdfProductSchema>;
export type PdfPurchase = typeof pdfPurchases.$inferSelect;
export type InsertPdfPurchase = z.infer<typeof insertPdfPurchaseSchema>;

export type EventType = 
  | 'page_view'
  | 'app_download'
  | 'play_store_click'
  | 'app_store_click'  
  | 'conversion'
  | 'newsletter_signup'
  | 'contact_form'
  | 'social_click'
  | 'consultation_draw_entry'
  | 'lead_magnet_download'
  | 'ai_chat'
  | 'pdf_download';
