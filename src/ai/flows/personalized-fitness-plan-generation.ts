// Removed 'use server' to allow static export

export interface PersonalizedFitnessPlanInput {
  bmiClassification: string;
  fitnessGoal: string;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: string;
}

export interface DietMeal {
  time: string;
  items: string[];
  calories: number;
}

export interface Exercise {
  day: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }[];
}

export interface PersonalizedFitnessPlanOutput {
  dietPlan: DietMeal[];
  exerciseRoutine: Exercise[];
}

export async function generatePersonalizedFitnessPlan(input: PersonalizedFitnessPlanInput): Promise<PersonalizedFitnessPlanOutput> {
  // Mock data to bypass Server Actions and allow GitHub Pages static export
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dietPlan: [
          {
            time: "Breakfast",
            items: ["Oatmeal with berries", "2 hard-boiled eggs", "Black coffee"],
            calories: 450
          },
          {
            time: "Lunch",
            items: ["Grilled chicken salad", "Quinoa", "Avocado"],
            calories: 600
          },
          {
            time: "Dinner",
            items: ["Baked salmon", "Steamed vegetables", "Brown rice"],
            calories: 700
          },
          {
            time: "Snacks",
            items: ["Greek yogurt", "Almonds"],
            calories: 300
          }
        ],
        exerciseRoutine: [
          {
            day: "Monday",
            description: "Upper Body Strength",
            exercises: [
              {
                name: "Push-ups",
                sets: 3,
                reps: "8-12",
                notes: "Perform on knees if needed"
              },
              {
                name: "Dumbbell Rows",
                sets: 3,
                reps: "10-12 each arm"
              }
            ]
          },
          {
            day: "Wednesday",
            description: "Lower Body & Core",
            exercises: [
              {
                name: "Squats",
                sets: 4,
                reps: "15"
              },
              {
                name: "Plank",
                sets: 3,
                reps: "60 seconds"
              }
            ]
          },
          {
            day: "Friday",
            description: "Full Body HIIT",
            exercises: [
              {
                name: "Burpees",
                sets: 3,
                reps: "15"
              },
              {
                name: "Mountain Climbers",
                sets: 3,
                reps: "40"
              }
            ]
          }
        ]
      });
    }, 1500); // Simulate network delay
  });
}
