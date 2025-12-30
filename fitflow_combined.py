"""Combined FitFlow Python stubs

This single file consolidates the small Python stubs previously generated
from the React project. It provides lightweight functions and schemas that
mirror the JS components and JSON schemas. Use this as a single-file
reference or minimal runtime for testing/experimentation.

Run `python fitflow_combined.py --list` to see available sections and
`python fitflow_combined.py --demo` for a short demo run.
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import argparse


# ----------------------------- Schemas ---------------------------------
meal_log_schema = {
    'name': 'MealLog',
    'type': 'object',
    'properties': {
        'log_date': {'type': 'string', 'format': 'date'},
        'meal_type': {'type': 'string'},
        'foods': {'type': 'array'},
        'total_calories': {'type': 'number'},
        'total_protein': {'type': 'number'},
        'total_carbs': {'type': 'number'},
        'total_fat': {'type': 'number'},
    },
    'required': ['log_date', 'meal_type', 'foods']
}

daily_log_schema = {
    'name': 'DailyLog',
    'type': 'object',
    'properties': {
        'log_date': {'type': 'string', 'format': 'date'},
        'exercises_completed': {'type': 'array'},
        'water_glasses': {'type': 'number', 'default': 0},
        'sleep_hours': {'type': 'number', 'default': 0},
        'steps': {'type': 'number', 'default': 0},
        'notes': {'type': 'string'}
    },
    'required': ['log_date']
}

community_schema = {
  'name': 'CommunityPost',
  'type': 'object',
  'properties': {
    'content': {'type': 'string'},
    'is_anonymous': {'type': 'boolean', 'default': False},
    'likes': {'type': 'number', 'default': 0},
    'replies': {'type': 'array'}
  },
  'required': ['content']
}

user_profile_schema = {
  'name': 'UserProfile',
  'type': 'object',
  'properties': {
    'age': {'type': 'number'},
    'height': {'type': 'number'},
    'weight': {'type': 'number'},
    'body_type': {'type': 'string'},
    'fitness_goal': {'type': 'string'},
    'posture_score': {'type': 'number'},
    'symmetry_score': {'type': 'number'},
    'workout_intensity': {'type': 'string'}
  }
}

workout_plan_schema = {
  'name': 'WorkoutPlan',
  'type': 'object',
  'properties': {
    'plan_name': {'type': 'string'},
    'goal': {'type': 'string'},
    'intensity': {'type': 'string'},
    'duration_weeks': {'type': 'number'},
    'exercises': {'type': 'array'}
  },
  'required': ['plan_name', 'goal']
}


# ----------------------------- Community --------------------------------
def sample_posts() -> List[Dict[str, Any]]:
    """Return a small list of mock community posts."""
    return [
        {'id': 'p1', 'content': 'Loving the new workouts!', 'likes': 5, 'replies': []},
        {'id': 'p2', 'content': 'How to improve posture?', 'likes': 2, 'replies': []}
    ]


# ----------------------------- Dashboard --------------------------------
def dashboard_info() -> Dict[str, str]:
    return {
        'name': 'Dashboard (stub)',
        'description': 'Provides high-level user summary and quick actions.'
    }


# ----------------------------- Settings ---------------------------------
def get_profile_stub() -> Dict[str, Any]:
    return {
        'full_name': 'Demo User',
        'email': 'demo@example.com',
        'posture_score': 72,
        'symmetry_score': 68,
        'workout_intensity': 'intermediate'
    }


def save_profile(data: Dict[str, Any]) -> Dict[str, Any]:
    return {'status': 'ok', 'saved': data}


# ----------------------------- Analytics --------------------------------
def sample_insights() -> Dict[str, Any]:
    return {
        'overallScore': 78,
        'topRecommendation': 'Increase sleep to 7-8 hours/night',
        'insights': [
            {'title': 'Sleep vs Performance', 'description': 'Better sleep correlates with more workouts', 'type': 'correlation'},
            {'title': 'Hydration', 'description': 'Average water is low, aim for +2 glasses', 'type': 'suggestion'}
        ]
    }


# ----------------------------- Nutrition --------------------------------
def compute_daily_totals(meal_logs: List[Dict[str, Any]]) -> Dict[str, float]:
    totals = {'calories': 0.0, 'protein': 0.0, 'carbs': 0.0, 'fat': 0.0}
    for meal in meal_logs:
        totals['calories'] += meal.get('total_calories', 0)
        totals['protein'] += meal.get('total_protein', 0)
        totals['carbs'] += meal.get('total_carbs', 0)
        totals['fat'] += meal.get('total_fat', 0)
    return totals


# ----------------------------- Add Meal ---------------------------------
FOOD_DATABASE = [
    {'name': 'Chicken Breast', 'calories': 165, 'protein': 31},
    {'name': 'Brown Rice', 'calories': 216, 'protein': 5},
    {'name': 'Salmon', 'calories': 208, 'protein': 20}
]


def search_foods(query: str) -> List[Dict[str, Any]]:
    q = query.lower().strip()
    return [f for f in FOOD_DATABASE if q in f['name'].lower()]


def estimate_from_description(description: str) -> Dict[str, Any]:
    return {'name': description[:30], 'calories': 250, 'protein': 15}


# ----------------------------- AI Insights / Panels ----------------------
def generate_insights_for_all(data: Dict[str, Any]) -> List[Dict[str, str]]:
    return [
        {'type': 'positive', 'title': 'Great consistency', 'description': 'You worked out 5 days last week.'},
        {'type': 'suggestion', 'title': 'Hydration', 'description': 'Increase water by 1-2 glasses/day.'}
    ]


# ----------------------------- Onboarding steps -------------------------
def validate_basic_info(data: Dict[str, Any]) -> Dict[str, Any]:
    required = ['age', 'height', 'weight', 'body_type']
    missing = [k for k in required if k not in data or data[k] in (None, '')]
    return {'valid': len(missing) == 0, 'missing': missing}


def validate_measurements(data: Dict[str, Any]) -> Dict[str, Any]:
    required = ['chest', 'waist', 'hips', 'shoulder_width', 'arms', 'legs']
    missing = [k for k in required if k not in data]
    return {'valid': not missing, 'missing': missing}


def generate_ai_analysis_for_onboarding(form_data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'posture_score': 70,
        'symmetry_score': 65,
        'workout_intensity': 'intermediate',
        'reasoning': 'Balanced measurements with mild asymmetry.'
    }


# ----------------------------- Body / Charts -----------------------------
def generate_historical_body(profile: Dict[str, Any], days: int = 7) -> List[Dict[str, Any]]:
    if not profile:
        return []
    base_weight = profile.get('weight', 70)
    data = []
    for i in range(days):
        data.append({'date': f'Day {i+1}', 'weight': round(base_weight - i * 0.1, 1)})
    return data


def macro_breakdown(totals: Dict[str, float]) -> Dict[str, float]:
    protein_cals = totals.get('protein', 0) * 4
    carbs_cals = totals.get('carbs', 0) * 4
    fat_cals = totals.get('fat', 0) * 9
    total = protein_cals + carbs_cals + fat_cals
    return {
        'protein': protein_cals,
        'carbs': carbs_cals,
        'fat': fat_cals,
        'total_calories': total
    }


def compute_targets(profile: Dict[str, Any]) -> Dict[str, int]:
    weight = profile.get('weight', 70)
    goal = profile.get('fitness_goal', 'weight_loss')
    if goal == 'muscle_gain':
        calorieTarget = weight * 35
        proteinTarget = weight * 2
    elif goal == 'weight_loss':
        calorieTarget = weight * 25
        proteinTarget = weight * 1.8
    else:
        calorieTarget = weight * 30
        proteinTarget = weight * 1.6
    return {'calories': round(calorieTarget), 'protein': round(proteinTarget)}


# ----------------------------- Meals / Cards ----------------------------
def meal_summary(meal: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'items': len(meal.get('foods', [])),
        'calories': meal.get('total_calories', 0)
    }


# ----------------------------- Metrics & Quick Tracker ------------------
def summarize_metrics(logs: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not logs:
        return {}
    avg_water = sum(l.get('water_glasses', 0) for l in logs) / len(logs)
    avg_sleep = sum(l.get('sleep_hours', 0) for l in logs) / len(logs)
    avg_steps = sum(l.get('steps', 0) for l in logs) / len(logs)
    return {'avg_water': avg_water, 'avg_sleep': avg_sleep, 'avg_steps': avg_steps}


# ----------------------------- Nutrition Insights -----------------------
def generate_nutrition_insights(weekly_logs: List[Dict[str, Any]], profile: Dict[str, Any], daily_totals: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not weekly_logs or len(weekly_logs) < 2:
        return None
    avg_cal = sum(m.get('total_calories', 0) for m in weekly_logs) / len(weekly_logs)
    return {
        'goalAlignment': 70,
        'topRecommendation': 'Slightly increase protein to reach 1.6–2g/kg',
        'insights': [
            {'title': 'Protein Intake', 'description': 'Protein is slightly below target.', 'type': 'suggestion'},
            {'title': 'Calories', 'description': 'Average calories align moderately with goal.', 'type': 'positive'}
        ]
    }


# ----------------------------- Wellness & Consistency ------------------
def time_series_from_logs(logs: List[Dict[str, Any]], key: str = 'sleep_hours', days: int = 7) -> List[Dict[str, Any]]:
    series = []
    for i in range(days):
        series.append({'date': f'Day {i+1}', 'value': logs[i].get(key, 0) if i < len(logs) else 0})
    return series


def compute_completion(logs: List[Dict[str, Any]], workout_plan: Dict[str, Any]) -> List[Dict[str, Any]]:
    return [{'date': f'Day {i+1}', 'percentage': (i * 10) % 100} for i in range(7)]


# ----------------------------- Workout Plan -----------------------------
def get_today_exercises(plan: Dict[str, Any], day_name: str) -> List[Dict[str, Any]]:
    return [ex for ex in plan.get('exercises', []) if ex.get('day') == day_name]


# ----------------------------- Daily Tracker ---------------------------
def make_log(date_str: str, water: int = 0, sleep: float = 0.0, steps: int = 0) -> Dict[str, Any]:
    return {'log_date': date_str, 'water_glasses': water, 'sleep_hours': sleep, 'steps': steps}


# ----------------------------- Goals -----------------------------------
def available_goals() -> List[str]:
    return ['weight_loss', 'muscle_gain', 'flexibility', 'posture_improvement', 'endurance']


# ----------------------------- Home / Layout ---------------------------
def check_auth(mock: bool = True) -> Dict[str, Any]:
    if mock:
        return {'authenticated': True, 'redirect': 'Dashboard'}
    return {'authenticated': False}


def nav_items() -> List[Dict[str, str]]:
    return [
        {'name': 'Home', 'path': 'Dashboard'},
        {'name': 'Workout', 'path': 'WorkoutPlan'},
        {'name': 'Nutrition', 'path': 'Nutrition'},
        {'name': 'Analytics', 'path': 'Analytics'},
        {'name': 'Settings', 'path': 'Settings'}
    ]


# ----------------------------- Posts -----------------------------------
def render_post(post: Dict[str, Any]) -> str:
    author = 'Anonymous' if post.get('is_anonymous') else post.get('created_by', 'User')
    return f"{author}: {post.get('content', '')} ({post.get('likes', 0)} likes)"


# ----------------------------- Quick helpers ---------------------------
def update_field(log: Dict[str, Any], field: str, value: Any) -> Dict[str, Any]:
    log[field] = value
    return log


# ----------------------------- Stats / Today ---------------------------
def create_stat_card(title: str, value: Any, subtitle: Optional[str] = None) -> Dict[str, Any]:
    return {'title': title, 'value': value, 'subtitle': subtitle}


def top_exercises(exercises: List[Dict[str, Any]], n: int = 3) -> List[Dict[str, Any]]:
    return exercises[:n]


# ----------------------------- Demo / CLI ------------------------------
MODULES = [
    'dashboard_info', 'get_profile_stub', 'sample_insights', 'compute_daily_totals', 'sample_posts',
    'search_foods', 'estimate_from_description', 'generate_nutrition_insights'
]


def list_sections():
    print('Available helper functions (sections):')
    for name in MODULES:
        print('  -', name)


def demo():
    print('\n=== Demo: dashboard_info ===')
    print(dashboard_info())
    print('\n=== Demo: get_profile_stub ===')
    print(get_profile_stub())
    print('\n=== Demo: compute_daily_totals (two meals) ===')
    print(compute_daily_totals([
        {'meal_type': 'breakfast', 'total_calories': 350, 'total_protein': 20, 'total_carbs': 40, 'total_fat': 10},
        {'meal_type': 'lunch', 'total_calories': 600, 'total_protein': 35, 'total_carbs': 70, 'total_fat': 18}
    ]))
    print('\n=== Demo: search_foods("chicken") ===')
    print(search_foods('chicken'))
    print('\n=== Demo: sample_insights ===')
    print(sample_insights())


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='FitFlow combined Python stubs')
    parser.add_argument('--list', action='store_true', help='List available sections')
    parser.add_argument('--demo', action='store_true', help='Run demo')
    args = parser.parse_args()

    if args.list:
        list_sections()
    elif args.demo:
        demo()
    else:
        list_sections()
        print('\nRun with --demo for example output')
