'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized diet plan and exercise routine based on user's BMI classification and fitness goal.
 *
 * - generatePersonalizedFitnessPlan - A function that generates the personalized fitness plan.
 * - PersonalizedFitnessPlanInput - The input type for the generatePersonalizedFitnessPlan function.
 * - PersonalizedFitnessPlanOutput - The return type for the generatePersonalizedFitnessPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFitnessPlanInputSchema = z.object({
  bmiClassification: z.string().describe('The BMI classification of the user (e.g., "Underweight", "Normal Weight", "Overweight", "Obese").'),
  fitnessGoal: z.string().describe('The fitness goal of the user (e.g., "Weight Loss", "Weight Gain", "Maintenance & Toning").'),
  heightCm: z.number().describe('The height of the user in centimeters.'),
  weightKg: z.number().describe('The weight of the user in kilograms.'),
  age: z.number().describe('The age of the user in years.'),
  gender: z.string().describe('The gender of the user.'),
});
export type PersonalizedFitnessPlanInput = z.infer<typeof PersonalizedFitnessPlanInputSchema>;

const DietMealSchema = z.object({
  time: z.string().describe('The meal time (e.g., "Breakfast", "Lunch", "Dinner", "Snacks").'),
  items: z.array(z.string()).describe('A list of food items for the meal.'),
  calories: z.number().describe('Estimated calories for the meal.'),
});

const ExerciseSchema = z.object({
  day: z.string().describe('The day of the week or a general descriptor (e.g., "Monday", "Full Body Workout Day 1").'),
  description: z.string().describe('A detailed description of the exercise routine for the day.'),
  exercises: z.array(z.object({
    name: z.string().describe('Name of the exercise (e.g., "Push-ups", "Squats").'),
    sets: z.number().describe('Number of sets.'),
    reps: z.string().describe('Number of repetitions (e.g., "10-12", "As many as possible").'),
    notes: z.string().optional().describe('Any specific notes or instructions for the exercise.'),
  })).describe('List of exercises for the day.'),
});


const PersonalizedFitnessPlanOutputSchema = z.object({
  dietPlan: z.array(DietMealSchema).describe('A personalized daily diet plan.'),
  exerciseRoutine: z.array(ExerciseSchema).describe('A personalized 7-day weekly exercise routine.'),
});
export type PersonalizedFitnessPlanOutput = z.infer<typeof PersonalizedFitnessPlanOutputSchema>;

export async function generatePersonalizedFitnessPlan(input: PersonalizedFitnessPlanInput): Promise<PersonalizedFitnessPlanOutput> {
  return personalizedFitnessPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFitnessPlanPrompt',
  input: {schema: PersonalizedFitnessPlanInputSchema},
  output: {schema: PersonalizedFitnessPlanOutputSchema},
  prompt: `You are an expert fitness and nutrition coach. Your goal is to create a personalized fitness plan (diet and exercise) for a user based on their BMI classification, fitness goal, and personal details.

User Details:
- BMI Classification: {{{bmiClassification}}}
- Fitness Goal: {{{fitnessGoal}}}
- Height: {{{heightCm}}} cm
- Weight: {{{weightKg}}} kg
- Age: {{{age}}} years
- Gender: {{{gender}}}

Based on the above details, generate a comprehensive daily diet plan and a 7-day weekly exercise routine.

For the diet plan:
- Provide a full day's meal plan including Breakfast, Lunch, Dinner, and Snacks.
- For each meal, list specific food items and estimated calories.
- The diet plan should align with the user's fitness goal and BMI classification. For example, a "Weight Loss" goal for an "Overweight" user should focus on a caloric deficit, while a "Weight Gain" goal for an "Underweight" user should focus on a caloric surplus.

For the exercise routine:
- Provide a 7-day workout schedule.
- For each day, describe the type of workout (e.g., "Upper Body", "Lower Body", "Cardio", "Rest").
- List specific exercises for each workout day, including sets and reps. Include notes for exercises if necessary.
- Ensure the exercise routine is suitable for the user's fitness goal and BMI classification.

Example of diet plan structure:
[
  {
    "time": "Breakfast",
    "items": ["Oatmeal with berries", "2 hard-boiled eggs"],
    "calories": 450
  },
  {
    "time": "Lunch",
    "items": ["Grilled chicken salad", "Quinoa"],
    "calories": 600
  },
  {
    "time": "Dinner",
    "items": ["Baked salmon", "Steamed vegetables", "Brown rice"],
    "calories": 700
  },
  {
    "time": "Snacks",
    "items": ["Greek yogurt", "Almonds"],
    "calories": 300
  }
]

Example of exercise routine structure:
[
  {
    "day": "Monday",
    "description": "Upper Body Strength",
    "exercises": [
      {
        "name": "Push-ups",
        "sets": 3,
        "reps": "8-12",
        "notes": "Perform on knees if needed"
      },
      {
        "name": "Dumbbell Rows",
        "sets": 3,
        "reps": "10-12 each arm"
      }
    ]
  }
]

Generate the response in JSON format according to the output schema.
`,
});

const personalizedFitnessPlanFlow = ai.defineFlow(
  {
    name: 'personalizedFitnessPlanFlow',
    inputSchema: PersonalizedFitnessPlanInputSchema,
    outputSchema: PersonalizedFitnessPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
