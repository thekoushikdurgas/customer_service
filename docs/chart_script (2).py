import plotly.graph_objects as go
import plotly.express as px
import json

# Data
data = [
  {"phase": "Phase 1: Foundation", "weeks": "1-2", "features": ["Project Setup", "Authentication", "Dark Theme UI", "Navigation"], "complexity": "Low", "duration": 2},
  {"phase": "Phase 2: Messaging", "weeks": "3-4", "features": ["WebSocket Setup", "Real-time Chat", "Message UI", "User Management"], "complexity": "Medium", "duration": 2},
  {"phase": "Phase 3: Voice Calls", "weeks": "5-6", "features": ["WebRTC Integration", "Audio Streams", "Call Controls", "Signaling"], "complexity": "High", "duration": 2},
  {"phase": "Phase 4: Video Calls", "weeks": "7-8", "features": ["Video Streams", "Camera Controls", "Call UI", "Media Management"], "complexity": "High", "duration": 2},
  {"phase": "Phase 5: Screen Share", "weeks": "9-10", "features": ["Screen Capture", "Share Controls", "Permissions", "Advanced UI"], "complexity": "High", "duration": 2},
  {"phase": "Phase 6: Finalization", "weeks": "11-12", "features": ["Testing", "Performance", "Bug Fixes", "Deployment"], "complexity": "Medium", "duration": 2}
]

# Color mapping for complexity
complexity_colors = {
    "Low": "#1FB8CD",
    "Medium": "#2E8B57", 
    "High": "#DB4545"
}

# Prepare data for Gantt chart
phases = []
start_weeks = []
durations = []
colors = []
hover_texts = []

for i, item in enumerate(data):
    # Shorten phase names to fit 15 character limit
    phase_short = f"Phase {i+1}"
    phases.append(phase_short)
    
    # Calculate start week (weeks are 1-indexed)
    week_range = item["weeks"].split("-")
    start_week = int(week_range[0]) - 1  # Convert to 0-indexed for positioning
    start_weeks.append(start_week)
    
    durations.append(item["duration"])
    colors.append(complexity_colors[item["complexity"]])
    
    # Create hover text with features
    features_text = ", ".join(item["features"][:3])  # Show first 3 features
    if len(item["features"]) > 3:
        features_text += "..."
    hover_text = f"{item['phase']}<br>Weeks: {item['weeks']}<br>Complexity: {item['complexity']}<br>Features: {features_text}"
    hover_texts.append(hover_text)

# Create Gantt chart using bar chart
fig = go.Figure()

for i in range(len(phases)):
    fig.add_trace(go.Bar(
        x=[durations[i]],
        y=[phases[i]],
        orientation='h',
        base=start_weeks[i],
        marker_color=colors[i],
        hovertemplate=hover_texts[i] + "<extra></extra>",
        name=data[i]["complexity"],
        showlegend=False
    ))

# Add legend entries for complexity levels
for complexity, color in complexity_colors.items():
    fig.add_trace(go.Bar(
        x=[0],
        y=[phases[0]],
        marker_color=color,
        name=complexity,
        visible='legendonly'
    ))

# Update layout
fig.update_layout(
    title="Flutter App Dev Timeline",
    xaxis_title="Weeks",
    yaxis_title="Dev Phases",
    xaxis=dict(
        tickmode='linear',
        tick0=0,
        dtick=1,
        range=[-0.5, 12.5],
        tickvals=list(range(13)),
        ticktext=[str(i) for i in range(13)]
    ),
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5,
        title="Complexity"
    ),
    barmode='overlay'
)

# Update y-axis to reverse order so Phase 1 appears at top
fig.update_yaxes(categoryorder='array', categoryarray=phases[::-1])

# Save the chart
fig.write_image("flutter_timeline.png")