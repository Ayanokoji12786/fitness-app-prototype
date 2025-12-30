"""
FitFlow Mobile App - Kivy GUI wrapper for fitflow_combined.py
This creates an Android-compatible UI using Kivy
"""

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.scrollview import ScrollView
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.popup import Popup
from kivy.uix.image import Image
from kivy.core.window import Window
from kivy.uix.tabbedpanel import TabbedPanel, TabbedPanelItem
import fitflow_combined as ff
from datetime import datetime

# Set window size
Window.size = (400, 800)


class FitFlowApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_profile = ff.get_profile_stub()
        self.daily_logs = []
        self.meal_logs = []

    def build(self):
        """Build the main UI"""
        self.title = 'FitFlow - Fitness Tracker'
        
        # Main container with tabs
        root = TabbedPanel(do_default_tab=False)
        
        # Dashboard Tab
        dashboard_tab = TabbedPanelItem(text='Dashboard')
        dashboard_tab.content = self.build_dashboard()
        root.add_widget(dashboard_tab)
        
        # Nutrition Tab
        nutrition_tab = TabbedPanelItem(text='Nutrition')
        nutrition_tab.content = self.build_nutrition()
        root.add_widget(nutrition_tab)
        
        # Workouts Tab
        workouts_tab = TabbedPanelItem(text='Workouts')
        workouts_tab.content = self.build_workouts()
        root.add_widget(workouts_tab)
        
        # Community Tab
        community_tab = TabbedPanelItem(text='Community')
        community_tab.content = self.build_community()
        root.add_widget(community_tab)
        
        # Settings Tab
        settings_tab = TabbedPanelItem(text='Settings')
        settings_tab.content = self.build_settings()
        root.add_widget(settings_tab)
        
        return root

    def build_dashboard(self):
        """Dashboard view with quick stats"""
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        # Header
        title = Label(text='Dashboard', size_hint_y=0.1, bold=True, font_size='20sp')
        layout.add_widget(title)
        
        # Scrollable content
        scroll = ScrollView(size_hint=(1, 0.9))
        content = GridLayout(cols=2, spacing=10, size_hint_y=None, padding=10)
        content.bind(minimum_height=content.setter('height'))
        
        # Stats cards
        stats = [
            ('Overall Score', '78'),
            ('Water Intake', '6/8 glasses'),
            ('Sleep', '7 hrs'),
            ('Steps', '8,243'),
            ('Calories', '2,150/2,500'),
            ('Protein', '65g'),
        ]
        
        for stat_title, stat_value in stats:
            card = BoxLayout(orientation='vertical', size_hint_y=None, height=100)
            card.canvas.clear()
            card.add_widget(Label(text=stat_title, bold=True))
            card.add_widget(Label(text=stat_value, font_size='18sp'))
            content.add_widget(card)
        
        scroll.add_widget(content)
        layout.add_widget(scroll)
        
        return layout

    def build_nutrition(self):
        """Nutrition tracking view"""
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        title = Label(text='Nutrition Tracker', size_hint_y=0.1, bold=True, font_size='20sp')
        layout.add_widget(title)
        
        scroll = ScrollView()
        content = GridLayout(cols=1, spacing=10, size_hint_y=None, padding=10)
        content.bind(minimum_height=content.setter('height'))
        
        # Sample meals
        meals_section = Label(text='Today\'s Meals:', size_hint_y=None, height=40, bold=True)
        content.add_widget(meals_section)
        
        sample_meals = [
            'Breakfast: Oatmeal with berries - 350 cal',
            'Lunch: Chicken & rice - 600 cal',
            'Snack: Protein bar - 200 cal'
        ]
        
        for meal in sample_meals:
            meal_label = Label(text=meal, size_hint_y=None, height=40)
            content.add_widget(meal_label)
        
        # Add meal button
        add_meal_btn = Button(text='Add Meal', size_hint_y=None, height=50)
        add_meal_btn.bind(on_press=self.show_add_meal_dialog)
        content.add_widget(add_meal_btn)
        
        # Insights
        insights_section = Label(text='Insights:', size_hint_y=None, height=40, bold=True)
        content.add_widget(insights_section)
        
        insights = ff.sample_insights()
        for insight in insights.get('insights', []):
            insight_text = f"{insight['title']}: {insight['description']}"
            insight_label = Label(text=insight_text, size_hint_y=None, height=60)
            content.add_widget(insight_label)
        
        scroll.add_widget(content)
        layout.add_widget(scroll)
        
        return layout

    def build_workouts(self):
        """Workouts view"""
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        title = Label(text='Workout Plan', size_hint_y=0.1, bold=True, font_size='20sp')
        layout.add_widget(title)
        
        scroll = ScrollView()
        content = GridLayout(cols=1, spacing=10, size_hint_y=None, padding=10)
        content.bind(minimum_height=content.setter('height'))
        
        # Sample workout plan
        exercises = [
            {'day': 'Monday', 'name': 'Bench Press', 'sets': 4, 'reps': 8},
            {'day': 'Monday', 'name': 'Incline Dumbbell', 'sets': 3, 'reps': 10},
            {'day': 'Tuesday', 'name': 'Squat', 'sets': 4, 'reps': 6},
            {'day': 'Wednesday', 'name': 'Deadlift', 'sets': 3, 'reps': 5},
        ]
        
        for exercise in exercises:
            ex_text = f"{exercise['day']}: {exercise['name']} - {exercise['sets']}x{exercise['reps']}"
            ex_btn = Button(text=ex_text, size_hint_y=None, height=50)
            ex_btn.bind(on_press=lambda x: self.log_exercise(exercise))
            content.add_widget(ex_btn)
        
        scroll.add_widget(content)
        layout.add_widget(scroll)
        
        return layout

    def build_community(self):
        """Community feed"""
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        title = Label(text='Community', size_hint_y=0.1, bold=True, font_size='20sp')
        layout.add_widget(title)
        
        scroll = ScrollView()
        content = GridLayout(cols=1, spacing=10, size_hint_y=None, padding=10)
        content.bind(minimum_height=content.setter('height'))
        
        posts = ff.sample_posts()
        for post in posts:
            post_text = ff.render_post(post)
            post_label = Label(text=post_text, size_hint_y=None, height=60)
            content.add_widget(post_label)
        
        # New post button
        new_post_btn = Button(text='Create Post', size_hint_y=None, height=50)
        new_post_btn.bind(on_press=self.show_new_post_dialog)
        content.add_widget(new_post_btn)
        
        scroll.add_widget(content)
        layout.add_widget(scroll)
        
        return layout

    def build_settings(self):
        """Settings view"""
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        title = Label(text='Settings', size_hint_y=0.1, bold=True, font_size='20sp')
        layout.add_widget(title)
        
        scroll = ScrollView()
        content = GridLayout(cols=1, spacing=15, size_hint_y=None, padding=10)
        content.bind(minimum_height=content.setter('height'))
        
        # Profile section
        profile_title = Label(text='Profile Information', size_hint_y=None, height=40, bold=True)
        content.add_widget(profile_title)
        
        # Display user info
        profile = self.user_profile
        info_items = [
            f"Name: {profile.get('full_name', 'N/A')}",
            f"Email: {profile.get('email', 'N/A')}",
            f"Posture Score: {profile.get('posture_score', 'N/A')}",
            f"Symmetry Score: {profile.get('symmetry_score', 'N/A')}",
        ]
        
        for info in info_items:
            info_label = Label(text=info, size_hint_y=None, height=40)
            content.add_widget(info_label)
        
        # Action buttons
        edit_profile_btn = Button(text='Edit Profile', size_hint_y=None, height=50)
        edit_profile_btn.bind(on_press=self.edit_profile)
        content.add_widget(edit_profile_btn)
        
        logout_btn = Button(text='Logout', size_hint_y=None, height=50)
        logout_btn.bind(on_press=self.logout)
        content.add_widget(logout_btn)
        
        scroll.add_widget(content)
        layout.add_widget(scroll)
        
        return layout

    def show_add_meal_dialog(self, instance):
        """Show dialog to add a meal"""
        content = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        meal_input = TextInput(hint_text='Enter meal name', size_hint_y=0.3)
        calories_input = TextInput(hint_text='Calories', input_filter='int', size_hint_y=0.3)
        protein_input = TextInput(hint_text='Protein (g)', input_filter='int', size_hint_y=0.3)
        
        content.add_widget(Label(text='Add New Meal'))
        content.add_widget(meal_input)
        content.add_widget(calories_input)
        content.add_widget(protein_input)
        
        btn_layout = BoxLayout(size_hint_y=0.2, spacing=10)
        save_btn = Button(text='Save')
        cancel_btn = Button(text='Cancel')
        btn_layout.add_widget(save_btn)
        btn_layout.add_widget(cancel_btn)
        content.add_widget(btn_layout)
        
        popup = Popup(title='Add Meal', content=content, size_hint=(0.9, 0.7))
        
        def save_meal(btn):
            # Save meal logic here
            popup.dismiss()
        
        save_btn.bind(on_press=save_meal)
        cancel_btn.bind(on_press=popup.dismiss)
        
        popup.open()

    def show_new_post_dialog(self, instance):
        """Show dialog to create a new community post"""
        content = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        post_input = TextInput(hint_text='What\'s on your mind?', size_hint_y=0.6)
        anonymous_check = Label(text='Post as Anonymous', size_hint_y=0.2)
        
        content.add_widget(post_input)
        content.add_widget(anonymous_check)
        
        btn_layout = BoxLayout(size_hint_y=0.2, spacing=10)
        post_btn = Button(text='Post')
        cancel_btn = Button(text='Cancel')
        btn_layout.add_widget(post_btn)
        btn_layout.add_widget(cancel_btn)
        content.add_widget(btn_layout)
        
        popup = Popup(title='New Post', content=content, size_hint=(0.9, 0.7))
        
        def submit_post(btn):
            popup.dismiss()
        
        post_btn.bind(on_press=submit_post)
        cancel_btn.bind(on_press=popup.dismiss)
        
        popup.open()

    def log_exercise(self, exercise):
        """Log an exercise completion"""
        print(f"Logged: {exercise['name']}")

    def edit_profile(self, instance):
        """Edit user profile"""
        print("Edit profile")

    def logout(self, instance):
        """Logout user"""
        self.stop()


if __name__ == '__main__':
    FitFlowApp().run()
