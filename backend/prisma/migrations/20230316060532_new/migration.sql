-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "category1" TEXT NOT NULL,
    "category2" TEXT NOT NULL,
    "category3" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "recipeTitle" TEXT NOT NULL,
    "recipeUrl" TEXT NOT NULL,
    "recipeDescription" TEXT NOT NULL,
    "foodImageUrls" TEXT[],
    "keywords" TEXT[],
    "totalTime" INTEGER NOT NULL,
    "recipeMaterial" TEXT[],

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipesTmp" (
    "id" SERIAL NOT NULL,
    "recipeTitle" TEXT NOT NULL,
    "recipeUrl" TEXT NOT NULL,
    "recipeDescription" TEXT NOT NULL,
    "foodImageUrls" TEXT[],
    "keywords" TEXT[],
    "totalTime" INTEGER NOT NULL,
    "recipeMaterial" TEXT[],

    CONSTRAINT "RecipesTmp_pkey" PRIMARY KEY ("id")
);
