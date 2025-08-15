import plotly.graph_objects as go

# Data for the Flutter architecture layers
data = [
  {"layer": "Presentation", "components": ["Chat UI", "Video Call UI", "Voice Call UI", "Screen Share", "Settings"], "level": 1, "color": "#1FB8CD"},
  {"layer": "State Mgmt", "components": ["BLoC Pattern", "Provider", "Riverpod", "State Streams"], "level": 2, "color": "#DB4545"},
  {"layer": "Business Logic", "components": ["Call Manager", "Message Svc", "User Mgmt", "Media Control"], "level": 3, "color": "#2E8B57"},
  {"layer": "Data Layer", "components": ["Local DB", "Cache", "User Prefs", "Msg Storage"], "level": 4, "color": "#5D878F"},
  {"layer": "Network Layer", "components": ["WebRTC Client", "WebSocket", "REST API", "Media Streams"], "level": 5, "color": "#D2BA4C"},
  {"layer": "External Svc", "components": ["Signal Server", "TURN/STUN", "Backend API", "Push Notify"], "level": 6, "color": "#B4413C"}
]

# Create the figure
fig = go.Figure()

# Add layer backgrounds and components
for layer_data in data:
    layer_name = layer_data["layer"]
    components = layer_data["components"]
    level = layer_data["level"]
    color = layer_data["color"]
    
    # Add background rectangle for each layer
    fig.add_shape(
        type="rect",
        x0=0, x1=12,
        y0=level - 0.4, y1=level + 0.4,
        fillcolor=color,
        opacity=0.2,
        line=dict(color=color, width=2)
    )
    
    # Add layer name on the left with better sizing
    fig.add_annotation(
        x=0.5,
        y=level,
        text=f"<b>{layer_name}</b>",
        showarrow=False,
        font=dict(size=14, color="black"),
        xanchor="left",
        yanchor="middle",
        bgcolor="white",
        bordercolor=color,
        borderwidth=2,
        borderpad=4
    )
    
    # Position components horizontally within each layer
    for i, component in enumerate(components):
        x_pos = 3 + i * 2.2  # Better spacing
        
        # Add component rectangle
        fig.add_shape(
            type="rect",
            x0=x_pos - 0.9, x1=x_pos + 0.9,
            y0=level - 0.25, y1=level + 0.25,
            fillcolor=color,
            opacity=0.8,
            line=dict(color=color, width=1)
        )
        
        # Add component text
        fig.add_annotation(
            x=x_pos,
            y=level,
            text=f"<b>{component}</b>",
            showarrow=False,
            font=dict(size=11, color="white"),
            xanchor="center",
            yanchor="middle"
        )

# Add more visible arrows showing data flow between layers
for i in range(len(data) - 1):
    current_level = data[i]["level"]
    next_level = data[i + 1]["level"]
    
    # Add multiple arrows for better visibility
    arrow_positions = [4, 6, 8, 10]
    for pos in arrow_positions:
        fig.add_annotation(
            x=pos, 
            y=current_level - 0.4,
            ax=pos, 
            ay=next_level + 0.4,
            arrowhead=2,
            arrowsize=1.5,
            arrowwidth=3,
            arrowcolor="#333333",
            showarrow=True,
            text="",
            opacity=0.8
        )

# Update layout
fig.update_layout(
    title="Flutter App Architecture",
    xaxis=dict(
        showticklabels=False,
        showgrid=False,
        zeroline=False,
        range=[0, 12]
    ),
    yaxis=dict(
        showticklabels=False,
        showgrid=False,
        zeroline=False,
        range=[0.5, 6.5],
        autorange='reversed'  # Top layer at top
    ),
    showlegend=False,
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Save the chart
fig.write_image("flutter_architecture.png")