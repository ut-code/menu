-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "category1" TEXT NOT NULL,
    "category2" TEXT,
    "category3" TEXT,
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT[],
    "totalCookingTime" INTEGER NOT NULL DEFAULT -1,
    "materials" TEXT[],
    "materialsConverted" TEXT NOT NULL,
    "foodImageUrl" TEXT NOT NULL,
    "dish" TEXT,
    "category" TEXT,
    "cuisine" TEXT,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipesBackup" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalCookingTime" INTEGER NOT NULL DEFAULT -1,
    "materials" TEXT[],
    "materialsConverted" TEXT NOT NULL,
    "keywords" TEXT[],
    "sourceUrl" TEXT NOT NULL,
    "foodImageUrl" TEXT NOT NULL,

    CONSTRAINT "RecipesBackup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeMaterialsSearch" (
    "id" SERIAL NOT NULL,
    "material" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeMaterialsSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Urls" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL DEFAULT '名無し',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavorites" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeSubmissions" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeSubmissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_categoryId_key" ON "Categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipes_recipeUrl_key" ON "Recipes"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "RecipesBackup_sourceUrl_key" ON "RecipesBackup"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeMaterialsSearch_material_key" ON "RecipeMaterialsSearch"("material");

-- CreateIndex
CREATE UNIQUE INDEX "Urls_url_key" ON "Urls"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorites_userId_recipeId_key" ON "UserFavorites"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeSubmissions_userId_recipeId_key" ON "RecipeSubmissions"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "RecipeMaterialsSearch" ADD CONSTRAINT "RecipeMaterialsSearch_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorites" ADD CONSTRAINT "UserFavorites_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorites" ADD CONSTRAINT "UserFavorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSubmissions" ADD CONSTRAINT "RecipeSubmissions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSubmissions" ADD CONSTRAINT "RecipeSubmissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

