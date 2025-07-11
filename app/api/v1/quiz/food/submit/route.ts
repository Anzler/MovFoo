// ~/Projects/movfoo/app/api/v1/quiz/food/submit/route.ts

import { NextResponse } from "next/server";

const MOCK_RECIPES = [
  {
    name: "Stuffed Bell Peppers",
    description: "Healthy and easy stuffed peppers with rice and ground turkey.",
    prep_time: "45 minutes",
    poster_url: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
  },
  {
    name: "Zucchini Noodles with Pesto",
    description: "Low-carb spiralized zucchini with homemade basil pesto.",
    prep_time: "25 minutes",
    poster_url: "https://spoonacular.com/recipeImages/660228-556x370.jpg",
  },
];

export async function POST(request: Request) {
  // you could read real answers here:
  // const { answers } = await request.json();
  return NextResponse.json({ results: MOCK_RECIPES });
}

