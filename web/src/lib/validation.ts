import { z } from "zod";

export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "birthDate must be in YYYY-MM-DD format")
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date")
  .refine((val) => {
    const date = new Date(val);
    return date < new Date();
  }, "Birth date must be in the past")
  .refine((val) => {
    const year = parseInt(val.substring(0, 4), 10);
    return year >= 1900;
  }, "Birth date must not be before 1900");

export const birthTimeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "birthTime must be in HH:mm format")
  .optional();

export const questionSchema = z
  .string()
  .trim()
  .min(5, "Question must be at least 5 characters")
  .max(500, "Question must be at most 500 characters");

export const questionCategorySchema = z
  .enum([
    "beziehung",
    "beruf",
    "selbstreflexion",
    "spirituell",
    "gesundheit_hinweis",
    "sonstiges",
  ])
  .optional();

export const feedbackRatingSchema = z.enum([
  "positiv",
  "teilweise",
  "negativ",
]);

export const feedbackTagsSchema = z
  .array(
    z.enum([
      "hilfreich",
      "zu_allgemein",
      "zu_intensiv",
      "unpassend",
      "mehr_astrologie",
      "mehr_tarot",
    ])
  )
  .optional();

export const createReadingSchema = z.object({
  question: questionSchema,
  birthProfileId: z.string().optional(),
  questionCategory: questionCategorySchema,
  sessionToken: z.string().optional(),
});

export const createFeedbackSchema = z.object({
  rating: feedbackRatingSchema,
  tags: feedbackTagsSchema,
  comment: z.string().optional(),
});

export const createBirthProfileSchema = z.object({
  birthDate: birthDateSchema,
  birthTime: birthTimeSchema,
  birthCity: z.string().optional(),
  birthLat: z.number().min(-90).max(90).optional(),
  birthLon: z.number().min(-180).max(180).optional(),
  timezone: z.string().optional(),
  sessionToken: z.string().optional(),
});

export const completeReadingSchema = z.object({
  readingText: z.string().min(1, "Reading text is required"),
  modelUsed: z.string().optional(),
  tokensUsed: z.number().int().nonnegative().optional(),
  latencyMs: z.number().int().nonnegative().optional(),
  contextJson: z.string().optional(),
});
