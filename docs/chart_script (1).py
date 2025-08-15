import plotly.graph_objects as go
import pandas as pd
import json

# Data
data = [
    {"pattern": "BLoC", "learning_curve": 3, "performance": 5, "scalability": 5, "testing": 5, "community": 5, "dev_speed": 3},
    {"pattern": "Provider", "learning_curve": 4, "performance": 4, "scalability": 4, "testing": 4, "community": 5, "dev_speed": 4},
    {"pattern": "Riverpod", "learning_curve": 3, "performance": 5, "scalability": 5, "testing": 5, "community": 4, "dev_speed": 4},
    {"pattern": "setState", "learning_curve": 5, "performance": 2, "scalability": 2, "testing": 2, "community": 5, "dev_speed": 5}
]

df = pd.DataFrame(data)

# Criteria labels (abbreviated to 15 characters)
categories = ['Learn Curve', 'Performance', 'Scalability', 'Testing', 'Community', 'Dev Speed']

# Brand colors for the 4 patterns
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F']

# Create radar chart
fig = go.Figure()

for i, pattern in enumerate(df['pattern']):
    values = [df.iloc[i]['learning_curve'], df.iloc[i]['performance'], 
              df.iloc[i]['scalability'], df.iloc[i]['testing'], 
              df.iloc[i]['community'], df.iloc[i]['dev_speed']]
    
    fig.add_trace(go.Scatterpolar(
        r=values,
        theta=categories,
        fill='toself',
        name=pattern,
        line_color=colors[i],
        fillcolor=colors[i],
        opacity=0.6
    ))

fig.update_layout(
    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 5],
            tickvals=[1, 2, 3, 4, 5],
            ticktext=['1', '2', '3', '4', '5']
        )),
    title="Flutter State Management",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

fig.write_image("flutter_state_management_radar.png")