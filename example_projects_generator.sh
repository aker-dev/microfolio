#!/bin/bash

# Script to generate µFolio example projects
# chmod +x example_projects_generator.sh
# Usage: ./example_projects_generator.sh

set -e

# Configuration
CONTENT_DIR="content/projects"
BASE_URL="https://placehold.co"

# Colors for messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display messages
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create SVG placeholder with attractive design
create_svg_placeholder() {
    local path="$1"
    local width="$2"
    local height="$3"
    local title="$4"
    local color="$5"
    local grad_id=$(echo "$title" | tr ' ' '_' | tr '[:upper:]' '[:lower:]')
    
    # Remove .jpg extension and add .svg
    local svg_path="${path%.jpg}.svg"
    
    cat > "$svg_path" << EOF
<svg width="$width" height="$height" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad_$grad_id" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}88;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad_$grad_id)"/>
  <rect x="20" y="20" width="$(($width-40))" height="$(($height-40))" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">
    $title
  </text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.8">
    ${width} × ${height}
  </text>
</svg>
EOF
    log "SVG placeholder created: $svg_path"
}

# Function to download a placeholder image with fallback
download_image() {
    local path="$1"
    local width="$2"
    local height="$3"
    local seed="$4"
    local title="$5"
    local bg_color="$6"
    local text_color="${7:-ffffff}"
    
    # Remove # from color codes for URL
    bg_color_clean=$(echo "$bg_color" | sed 's/#//')
    text_color_clean=$(echo "$text_color" | sed 's/#//')
    
    # Encode title for URL (replace spaces with %20)
    encoded_title=$(echo "$title" | sed 's/ /%20/g')
    
    # Construct placehold.co URL
    local placeholder_url="${BASE_URL}/${width}x${height}/${bg_color_clean}/${text_color_clean}/jpg?text=${encoded_title}"
    
    # Try to download with curl first
    if command -v curl >/dev/null 2>&1; then
        if curl -s --connect-timeout 10 --max-time 30 -o "$path" "$placeholder_url" 2>/dev/null; then
            # Check if file is valid (size > 1000 bytes)
            if [ -s "$path" ] && [ $(wc -c < "$path") -gt 1000 ]; then
                log "Image downloaded: $path"
                return 0
            fi
        fi
    fi
    
    # Try with wget if curl failed
    if command -v wget >/dev/null 2>&1; then
        if wget -q --timeout=30 -O "$path" "$placeholder_url" 2>/dev/null; then
            # Check if file is valid
            if [ -s "$path" ] && [ $(wc -c < "$path") -gt 1000 ]; then
                log "Image downloaded: $path"
                return 0
            fi
        fi
    fi
    
    # Fallback: create attractive SVG placeholder
    warn "Download failed, creating SVG placeholder for: $path"
    create_svg_placeholder "$path" "$width" "$height" "$title" "$bg_color"
}

# Function to create a PDF placeholder
create_pdf_placeholder() {
    local path="$1"
    local title="$2"
    
    # Create a text file that simulates a PDF
    cat > "$path" << EOF
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
>>
endobj

%% Placeholder PDF: $title
%% Generated automatically by µFolio
EOF
    log "PDF placeholder created: $path"
}

# Function to create a video placeholder
create_video_placeholder() {
    local path="$1"
    local duration="$2"
    
    # Create a text file that simulates a video
    cat > "$path" << EOF
# Placeholder Video File
# Filename: $(basename "$path")
# Duration: ${duration} seconds
# Format: MP4 (placeholder)
# 
# This file simulates a video. 
# Replace it with a real MP4 file for your project.
#
# Generated automatically by µFolio
EOF
    log "Video placeholder created: $path"
}

# Check if content folder exists
if [ ! -d "content" ]; then
    log "Creating content/ directory"
    mkdir -p content
fi

# Check internet connectivity
log "Checking internet connectivity..."
if command -v curl >/dev/null 2>&1; then
    if ! curl -s --connect-timeout 5 --head "$BASE_URL" >/dev/null 2>&1; then
        warn "No internet connection or placehold.co unavailable. Will create SVG placeholders instead."
    fi
elif command -v wget >/dev/null 2>&1; then
    if ! wget -q --timeout=5 --spider "$BASE_URL" 2>/dev/null; then
        warn "No internet connection or placehold.co unavailable. Will create SVG placeholders instead."
    fi
else
    warn "curl/wget not found. Will create SVG placeholders instead."
fi

# Create projects folder
log "Creating $CONTENT_DIR directory"
mkdir -p "$CONTENT_DIR"

echo -e "${BLUE}🚀 Generating µFolio example projects${NC}"
echo "===================================="

# 1. ARCHITECTURE PROJECT - Cultural Center Paris
log "📁 Creating project: cultural-center-paris"
PROJECT_DIR="$CONTENT_DIR/cultural-center-paris"
mkdir -p "$PROJECT_DIR"/{images,documents,videos}

# index.md
cat > "$PROJECT_DIR/index.md" << 'EOF'
---
title: "Cultural Center of Paris"
date: "2024-03-15"
location: "Paris, France"
coordinates: [48.8566, 2.3522]
description: "A modern cultural center in the heart of Paris, blending contemporary architecture with historical heritage"
type: "architecture"
tags: ["architecture", "cultural", "modern", "paris", "public"]
authors:
  - name: "Marie Dubois"
    role: "Lead Architect"
  - name: "Jean Martin"
    role: "Interior Designer"
featured: true
---

## Project Description

The Cultural Center of Paris represents a major architectural challenge: creating a modern and functional space while respecting the harmony of the historic district. The 3,500 m² building houses a media library, exhibition spaces, a 200-seat auditorium, and creative workshops.

## Architectural Concept

The center's architecture plays with transparency and natural light. The main facade, entirely glazed, reveals interior activities and creates a constant dialogue between public space and cultural space. The chosen materials - raw concrete, glass, and corten steel - create a strong identity while harmoniously integrating with the urban context.

## Sustainable Development

The project integrates numerous ecological solutions:
- Double-skin facade for thermal insulation
- 800 m² green roof
- Rainwater harvesting system
- Geothermal heating
- HQE certification level "Very High Performance"

## Program

- **Ground floor**: Reception hall, cultural café, shop
- **1st floor**: Media library and reading spaces
- **2nd floor**: Modular exhibition halls (400 m²)
- **3rd floor**: Auditorium and technical spaces
- **Basement**: Creative workshops and storage

## Technical Challenges

Building on a sloped site required innovative solutions:
- Special foundations on micropiles
- Mixed concrete/steel structure
- Complex circulation flow management
- Integration of existing urban networks

The project was delivered on schedule despite site constraints and strict environmental requirements.
EOF

# Images
download_image "$PROJECT_DIR/thumbnail.jpg" 800 600 1 "Cultural Center" "#2563EB" "#ffffff"
download_image "$PROJECT_DIR/images/facade-day.jpg" 1200 800 2 "Facade Day View" "#3B82F6" "#ffffff"
download_image "$PROJECT_DIR/images/facade-night.jpg" 1200 800 3 "Facade Night View" "#1E40AF" "#ffffff"
download_image "$PROJECT_DIR/images/interior-hall.jpg" 1200 800 4 "Interior Hall" "#6366F1" "#ffffff"
download_image "$PROJECT_DIR/images/aerial-view.jpg" 1200 800 5 "Aerial View" "#8B5CF6" "#ffffff"

# Documents
create_pdf_placeholder "$PROJECT_DIR/documents/architectural-plans.pdf" "Architectural Plans"
create_pdf_placeholder "$PROJECT_DIR/documents/specifications.pdf" "Technical Specifications"
create_pdf_placeholder "$PROJECT_DIR/documents/hqe-certification.pdf" "HQE Certification"

# Videos
create_video_placeholder "$PROJECT_DIR/videos/virtual-tour.mp4" 180

# 2. GRAPHIC DESIGN PROJECT - Tech Startup Identity
log "📁 Creating project: tech-startup-identity"
PROJECT_DIR="$CONTENT_DIR/tech-startup-identity"
mkdir -p "$PROJECT_DIR"/{images,documents}

# index.md
cat > "$PROJECT_DIR/index.md" << 'EOF'
---
title: "Brand Identity - TechFlow"
date: "2024-02-20"
location: "Lyon, France"
coordinates: [45.7640, 4.8357]
description: "Complete visual identity creation for a startup specializing in workflow automation"
type: "design"
tags: ["identity", "logo", "startup", "tech", "digital"]
authors:
  - name: "Sophie Chen"
    role: "Art Director"
  - name: "Alex Rivera"
    role: "Graphic Designer"
featured: false
---

## Project Brief

TechFlow, a Lyon-based startup specializing in enterprise workflow automation, needed a strong visual identity to stand out in the French technology ecosystem. The goal was to create a modern, accessible, and professional brand capable of reassuring business clients while reflecting technological innovation.

## Creative Process

### Research and Analysis
- In-depth competitive study
- Creative workshops with the founding team
- Brand values definition: innovation, simplicity, reliability
- Client persona mapping

### Concept Development
The logo is built around the idea of flow and connection. The custom typography combines modernity and readability, with rounded endings that evoke the fluidity of automated processes.

## Graphic Solutions

### Logo and Symbol
- Geometric symbol evoking data flow
- Monochrome, color, and simplified versions
- Perfect adaptability from favicon to billboard formats

### Color Palette
- **Primary Blue**: #2563EB (trust, technology)
- **Secondary Blue**: #1E40AF (depth, seriousness)
- **Neutral Gray**: #6B7280 (balance, modernity)
- **Accent Green**: #10B981 (growth, success)

### Typography
- **Headlines**: Inter Extra Bold (perfect screen readability)
- **Body Text**: Inter Regular/Medium (print/web versatility)
- **Code**: JetBrains Mono (consistency with tech universe)

## Applications

The identity was applied across all touchpoints:
- Complete stationery (business cards, letterheads, invoices)
- Responsive website and mobile application
- Office signage
- Sales materials (brochures, presentations)
- Promotional goods and textiles

## Results

6 months after launch, TechFlow recorded:
- +340% website visits
- +180% product demo requests
- 78% recognition rate among prospects
- €2.5M funding round facilitated by brand image

The new identity helped position TechFlow as a serious and innovative player in the French automation market.
EOF

# Images
download_image "$PROJECT_DIR/thumbnail.jpg" 800 600 6 "TechFlow Brand" "#10B981" "#ffffff"
download_image "$PROJECT_DIR/images/logo-variations.jpg" 1200 800 7 "Logo Variations" "#059669" "#ffffff"
download_image "$PROJECT_DIR/images/brand-guidelines.jpg" 1200 800 8 "Brand Guidelines" "#047857" "#ffffff"
download_image "$PROJECT_DIR/images/stationery-mockup.jpg" 1200 800 9 "Stationery Mockup" "#065F46" "#ffffff"
download_image "$PROJECT_DIR/images/web-applications.jpg" 1200 800 10 "Web Applications" "#064E3B" "#ffffff"

# Documents
create_pdf_placeholder "$PROJECT_DIR/documents/logo-usage-guide.pdf" "Logo Usage Guidelines"

# 3. ART INSTALLATION PROJECT - Light Installation 2024
log "📁 Creating project: light-installation-2024"
PROJECT_DIR="$CONTENT_DIR/light-installation-2024"
mkdir -p "$PROJECT_DIR"/{images,videos,documents}

# index.md
cat > "$PROJECT_DIR/index.md" << 'EOF'
---
title: "Resonance - Interactive Light Installation"
date: "2024-01-10"
location: "Marseille, France"
coordinates: [43.2965, 5.3698]
description: "Interactive light installation that responds to audience movements, creating a symphony of colors and sounds"
type: "art"
tags: ["installation", "interactive", "light", "technology", "public-art"]
authors:
  - name: "Elena Vasquez"
    role: "Digital Artist"
  - name: "Marcus Thompson"
    role: "Sound Designer"
  - name: "David Kim"
    role: "Technical Director"
featured: true
---

## Concept

"Resonance" is an interactive light installation that transforms public space into a living canvas. Using motion sensors and artificial intelligence, the installation responds to audience presence and movements, creating unique visual and sound compositions in real-time.

## Artistic Vision

The work explores the relationship between human presence and digital space. Each visitor becomes a conductor of light and sound, their movements generating waves of colors that propagate through the installation like ripples on water. The concept draws inspiration from quantum physics and the idea that observation changes reality.

## Technical Implementation

### Hardware
- 240 RGB LED strips (50 meters total)
- 12 ultrasonic motion sensors
- 8 directional speakers for spatial audio
- Central control system with NVIDIA Jetson Xavier
- Weather-resistant aluminum structure

### Software
- Real-time computer vision with OpenCV
- Custom particle system in TouchDesigner
- Generative audio engine in Max/MSP
- Machine learning for pattern recognition
- WebSocket API for remote monitoring

## Interaction Design

The installation operates on multiple interaction levels:

**Proximity**: Approaching the installation activates ambient lighting in warm tones
**Movement**: Walking triggers light trails that follow the visitor's path
**Gesture**: Arm movements create color explosions and harmonic clusters
**Group Dynamics**: Multiple visitors generate complex interference patterns

## Installation Process

The 3-week installation required:
- Structural engineering for 8-meter suspended elements
- Underground cabling (300 meters of fiber optic)
- Weather protection system for electronics
- Acoustic calibration for outdoor environment
- Safety protocols for public interaction

## Public Reception

During its 6-month exhibition, "Resonance" attracted:
- 45,000 visitors
- 120 hours of interaction data collected
- Featured in 15 international art publications
- Winner of the Digital Art Award 2024
- Invited to Venice Biennale 2025

## Technical Innovation

The project pioneered several techniques:
- Real-time body tracking without wearables
- Predictive lighting based on movement patterns
- Adaptive audio mixing for outdoor environments
- Energy-efficient LED control system

## Impact and Legacy

"Resonance" demonstrated how technology can create meaningful connections between strangers in public space. The installation's success led to commissions for similar works in Tokyo, New York, and Berlin, establishing a new paradigm for interactive urban art.

The collected interaction data is being used to study human behavior in digital environments, contributing to research in human-computer interaction and social psychology.
EOF

# Images
download_image "$PROJECT_DIR/thumbnail.jpg" 800 600 11 "Light Installation" "#F59E0B" "#ffffff"
download_image "$PROJECT_DIR/images/complete-installation.jpg" 1200 800 12 "Complete Setup" "#D97706" "#ffffff"
download_image "$PROJECT_DIR/images/technical-details.jpg" 1200 800 13 "Technical Details" "#B45309" "#ffffff"
download_image "$PROJECT_DIR/images/public-interaction.jpg" 1200 800 14 "Public Interaction" "#92400E" "#ffffff"

# Videos
create_video_placeholder "$PROJECT_DIR/videos/teaser.mp4" 60
create_video_placeholder "$PROJECT_DIR/videos/making-of.mp4" 300

# Documents
create_pdf_placeholder "$PROJECT_DIR/documents/press-kit.pdf" "Press Kit"

echo ""
echo -e "${GREEN}✅ Example projects generated successfully!${NC}"
echo ""
echo "📁 Projects created in: $CONTENT_DIR/"
echo "├── cultural-center-paris/"
echo "├── tech-startup-identity/"
echo "└── light-installation-2024/"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Replace placeholder images (JPG or SVG) with real project images"
echo "2. Update project content in index.md files"
echo "3. Add real PDF documents and videos"
echo "4. Customize project metadata (dates, locations, etc.)"
echo ""
echo -e "${BLUE}🚀 Start your dev server: pnpm dev${NC}"