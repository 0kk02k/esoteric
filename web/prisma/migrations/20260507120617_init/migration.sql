-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "displayName" TEXT,
    "authProvider" TEXT,
    "authProviderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BirthProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionToken" TEXT,
    "birthDate" DATETIME NOT NULL,
    "birthTime" TEXT,
    "birthCity" TEXT,
    "birthLat" REAL,
    "birthLon" REAL,
    "timezone" TEXT,
    "timeUnknown" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BirthProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartCalculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "birthProfileId" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL DEFAULT '1.0',
    "sunSign" TEXT NOT NULL,
    "moonSign" TEXT NOT NULL,
    "ascendantSign" TEXT,
    "planetData" TEXT NOT NULL,
    "houseData" TEXT,
    "aspectData" TEXT,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChartCalculation_birthProfileId_fkey" FOREIGN KEY ("birthProfileId") REFERENCES "BirthProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TarotCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "arcana" TEXT NOT NULL,
    "number" INTEGER,
    "suit" TEXT,
    "element" TEXT,
    "planet" TEXT,
    "zodiacSign" TEXT,
    "goldenDawnKey" TEXT,
    "keywordsUpright" TEXT NOT NULL,
    "keywordsReversed" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "TarotDraw" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "readingId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "upright" BOOLEAN NOT NULL DEFAULT true,
    "drawnAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TarotDraw_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TarotDraw_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "TarotCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionToken" TEXT,
    "birthProfileId" TEXT,
    "question" TEXT NOT NULL,
    "questionCategory" TEXT,
    "chartCalcId" TEXT,
    "promptVersion" TEXT NOT NULL DEFAULT '1.0',
    "safetyVersion" TEXT NOT NULL DEFAULT '1.0',
    "readingText" TEXT,
    "modelUsed" TEXT,
    "tokensUsed" INTEGER,
    "latencyMs" INTEGER,
    "contextJson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reading_birthProfileId_fkey" FOREIGN KEY ("birthProfileId") REFERENCES "BirthProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "readingId" TEXT NOT NULL,
    "userId" TEXT,
    "rating" TEXT NOT NULL,
    "tags" TEXT,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UsageLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionToken" TEXT,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "readingsCount" INTEGER NOT NULL DEFAULT 0,
    "followupsCount" INTEGER NOT NULL DEFAULT 0,
    "maxReadings" INTEGER NOT NULL DEFAULT 3,
    "maxFollowups" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UsageLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "stripePriceId" TEXT,
    "stripeSubId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "readingId" TEXT,
    "userId" TEXT,
    "sessionToken" TEXT,
    "eventType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "inputSnippet" TEXT,
    "actionTaken" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SafetyEvent_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SafetyEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TarotCard_name_key" ON "TarotCard"("name");
