#!/bin/bash

# Script to generate microfolio example projects
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
%% Generated automatically by microfolio
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
# Generated automatically by microfolio
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

# Project data arrays
PROJECT_TITLES=(
    "Cultural Center of Paris" "Brand Identity - TechFlow" "Resonance - Interactive Light Installation" "Modern Residential Complex" "E-commerce Platform Redesign"
    "Urban Sculpture Garden" "Digital Marketing Campaign" "Smart Home System" "Contemporary Art Gallery" "Mobile App UI/UX Design"
    "Sustainable Office Building" "Logo Design for Coffee Shop" "Virtual Reality Experience" "Minimalist House Design" "Social Media Strategy"
    "Public Art Installation" "Website Development" "Interior Design Studio" "Fashion Brand Identity" "Game Development Project"
    "Community Center Architecture" "Print Design Portfolio" "Interactive Museum Exhibit" "Luxury Apartment Design" "Digital Product Design"
    "Environmental Art Project" "Corporate Branding Package" "Augmented Reality App" "Hotel Interior Design" "Motion Graphics Project"
    "Mixed-Use Development" "Packaging Design Series" "Sound Art Installation" "Restaurant Interior" "User Experience Research"
    "Civic Architecture Project" "Publication Design" "Light Art Festival" "Residential Renovation" "Design System Creation"
    "Landscape Architecture" "Brand Strategy Development" "Performance Art Piece" "Commercial Space Design" "Product Design Innovation"
    "Cultural Heritage Building" "Visual Identity System" "Interactive Art Workshop" "Workplace Design" "Digital Illustration Series"
    "Transportation Hub Design" "Marketing Material Design" "Kinetic Art Installation" "Boutique Store Design" "Information Architecture"
    "Educational Facility" "Event Branding Project" "Video Art Production" "Kitchen Design Project" "Service Design Framework"
    "Religious Architecture" "Annual Report Design" "Projection Mapping Show" "Bathroom Renovation" "Design Research Study"
    "Sports Complex Design" "Poster Design Campaign" "Generative Art System" "Living Room Makeover" "Accessibility Design Audit"
    "Healthcare Facility" "Book Cover Design" "Digital Art Collection" "Home Office Design" "Usability Testing Project"
    "Retail Store Architecture" "Merchandise Design" "Art Therapy Installation" "Bedroom Interior Design" "Content Strategy Plan"
    "Library Building Design" "Signage System Design" "Community Art Project" "Dining Room Design" "Design Process Documentation"
    "Museum Architecture" "Album Cover Design" "Street Art Commission" "Garden Design Project" "Innovation Workshop Series"
    "Shopping Mall Design" "Logo Animation Project" "Sculpture Park Installation" "Terrace Design" "Design Thinking Workshop"
    "Concert Hall Architecture" "Web Banner Campaign" "Digital Mural Project" "Basement Renovation" "Creative Direction Project"
)

PROJECT_TYPES=(
    "architecture" "design" "art" "architecture" "design"
    "art" "design" "architecture" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "art" "design" "architecture" "design" "design"
    "architecture" "design" "art" "architecture" "design"
    "art" "design" "design" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
    "architecture" "design" "art" "architecture" "design"
)

LOCATIONS=(
    "Paris, France" "Lyon, France" "Marseille, France" "Nice, France" "Toulouse, France"
    "Bordeaux, France" "Lille, France" "Rennes, France" "Reims, France" "Saint-Étienne, France"
    "Le Havre, France" "Toulon, France" "Grenoble, France" "Dijon, France" "Angers, France"
    "Nîmes, France" "Villeurbanne, France" "Clermont-Ferrand, France" "Le Mans, France" "Aix-en-Provence, France"
    "Brest, France" "Limoges, France" "Tours, France" "Amiens, France" "Perpignan, France"
    "Metz, France" "Besançon, France" "Orléans, France" "Rouen, France" "Mulhouse, France"
    "Caen, France" "Nancy, France" "Avignon, France" "Cannes, France" "Annecy, France"
    "Versailles, France" "Poitiers, France" "Courbevoie, France" "Créteil, France" "Pau, France"
    "La Rochelle, France" "Calais, France" "Bourges, France" "Dunkerque, France" "Châteauroux, France"
    "Antibes, France" "Saint-Denis, France" "Argenteuil, France" "Montreuil, France" "Boulogne-Billancourt, France"
    "Nanterre, France" "Colombes, France" "Aulnay-sous-Bois, France" "Roubaix, France" "Tourcoing, France"
    "Nantes, France" "Strasbourg, France" "Montpellier, France" "Rennes, France" "Reims, France"
    "Le Havre, France" "Saint-Étienne, France" "Toulon, France" "Grenoble, France" "Dijon, France"
    "Angers, France" "Nîmes, France" "Villeurbanne, France" "Clermont-Ferrand, France" "Le Mans, France"
    "Aix-en-Provence, France" "Brest, France" "Limoges, France" "Tours, France" "Amiens, France"
    "Perpignan, France" "Metz, France" "Besançon, France" "Orléans, France" "Rouen, France"
    "Mulhouse, France" "Caen, France" "Nancy, France" "Avignon, France" "Cannes, France"
    "Annecy, France" "Versailles, France" "Poitiers, France" "Courbevoie, France" "Créteil, France"
    "Pau, France" "La Rochelle, France" "Calais, France" "Bourges, France" "Dunkerque, France"
    "Châteauroux, France" "Antibes, France" "Saint-Denis, France" "Argenteuil, France" "Montreuil, France"
)

COORDINATES=(
    "[48.8566, 2.3522]" "[45.7640, 4.8357]" "[43.2965, 5.3698]" "[43.7102, 7.2620]" "[43.6047, 1.4442]"
    "[44.8378, -0.5792]" "[50.6292, 3.0573]" "[48.1173, -1.6778]" "[49.2583, 4.0317]" "[45.4397, 4.3872]"
    "[49.4944, 0.1079]" "[43.1242, 5.9280]" "[45.1885, 5.7245]" "[47.3220, 5.0415]" "[47.4739, -0.5540]"
    "[43.8367, 4.3601]" "[45.7797, 4.9348]" "[45.7797, 3.0863]" "[48.0077, 0.1984]" "[43.5263, 5.4454]"
    "[48.3905, -4.4861]" "[45.8336, 1.2611]" "[47.3941, 0.6848]" "[49.8941, 2.2956]" "[42.6995, 2.8954]"
    "[49.1193, 6.1757]" "[47.2380, 6.0243]" "[47.9029, 1.9093]" "[49.4431, 1.0993]" "[47.7494, 7.3552]"
    "[49.1859, -0.3706]" "[48.6921, 6.1844]" "[43.9493, 4.8055]" "[43.5528, 7.0174]" "[45.8992, 6.1294]"
    "[48.8014, 2.1301]" "[46.5802, 0.3404]" "[48.8975, 2.2350]" "[48.7909, 2.4550]" "[43.3102, -0.3609]"
    "[46.1603, -1.1511]" "[50.9513, 1.8587]" "[47.0810, 2.3987]" "[51.0347, 2.3770]" "[46.8109, 1.6928]"
    "[43.5804, 7.1251]" "[48.9354, 2.3544]" "[48.9478, 2.2431]" "[48.8589, 2.4136]" "[48.8352, 2.2397]"
    "[48.8951, 2.2069]" "[48.9248, 2.2277]" "[48.9539, 2.4954]" "[50.6942, 3.1746]" "[50.7263, 3.1586]"
    "[47.2184, -1.5536]" "[48.5734, 7.7521]" "[43.6109, 3.8763]" "[48.1173, -1.6778]" "[49.2583, 4.0317]"
    "[49.4944, 0.1079]" "[45.4397, 4.3872]" "[43.1242, 5.9280]" "[45.1885, 5.7245]" "[47.3220, 5.0415]"
    "[47.4739, -0.5540]" "[43.8367, 4.3601]" "[45.7797, 4.9348]" "[45.7797, 3.0863]" "[48.0077, 0.1984]"
    "[43.5263, 5.4454]" "[48.3905, -4.4861]" "[45.8336, 1.2611]" "[47.3941, 0.6848]" "[49.8941, 2.2956]"
    "[42.6995, 2.8954]" "[49.1193, 6.1757]" "[47.2380, 6.0243]" "[47.9029, 1.9093]" "[49.4431, 1.0993]"
    "[47.7494, 7.3552]" "[49.1859, -0.3706]" "[48.6921, 6.1844]" "[43.9493, 4.8055]" "[43.5528, 7.0174]"
    "[45.8992, 6.1294]" "[48.8014, 2.1301]" "[46.5802, 0.3404]" "[48.8975, 2.2350]" "[48.7909, 2.4550]"
    "[43.3102, -0.3609]" "[46.1603, -1.1511]" "[50.9513, 1.8587]" "[47.0810, 2.3987]" "[51.0347, 2.3770]"
    "[46.8109, 1.6928]" "[43.5804, 7.1251]" "[48.9354, 2.3544]" "[48.9478, 2.2431]" "[48.8589, 2.4136]"
)

COLORS=(
    "#2563EB" "#10B981" "#F59E0B" "#EF4444" "#8B5CF6"
    "#EC4899" "#06B6D4" "#84CC16" "#F97316" "#6366F1"
    "#14B8A6" "#F43F5E" "#8B5A2B" "#059669" "#DC2626"
    "#7C3AED" "#0891B2" "#CA8A04" "#BE123C" "#9333EA"
    "#0D9488" "#E11D48" "#A16207" "#BE185D" "#7C2D12"
    "#047857" "#9F1239" "#92400E" "#881337" "#78350F"
    "#065F46" "#7F1D1D" "#451A03" "#4C1D95" "#1E293B"
    "#0F172A" "#450A0A" "#365314" "#14532D" "#7E22CE"
    "#5B21B6" "#6D28D9" "#1E40AF" "#1D4ED8" "#2563EB"
    "#3B82F6" "#60A5FA" "#93C5FD" "#DBEAFE" "#EFF6FF"
)

# Create projects folder
log "Creating $CONTENT_DIR directory"
mkdir -p "$CONTENT_DIR"

echo -e "${BLUE}🚀 Generating microfolio example projects (100 projects)${NC}"
echo "============================================================="

# Generate 100 projects
for i in {0..99}; do
    # Calculate indices for arrays
    title_index=$((i % ${#PROJECT_TITLES[@]}))
    type_index=$((i % ${#PROJECT_TYPES[@]}))
    location_index=$((i % ${#LOCATIONS[@]}))
    coord_index=$((i % ${#COORDINATES[@]}))
    color_index=$((i % ${#COLORS[@]}))
    
    # Get project data
    project_title="${PROJECT_TITLES[$title_index]}"
    project_type="${PROJECT_TYPES[$type_index]}"
    project_location="${LOCATIONS[$location_index]}"
    project_coords="${COORDINATES[$coord_index]}"
    project_color="${COLORS[$color_index]}"
    
    # Create unique slug (add number if needed to make unique)
    if [ $i -lt ${#PROJECT_TITLES[@]} ]; then
        project_slug=$(echo "$project_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    else
        base_slug=$(echo "$project_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
        project_slug="${base_slug}-$((i + 1))"
    fi
    
    # Create project
    log "📁 Creating project $((i + 1))/100: $project_slug"
    PROJECT_DIR="$CONTENT_DIR/$project_slug"
    mkdir -p "$PROJECT_DIR"/{images,documents,videos}

    # Generate dates (random within last year) - cross-platform compatible
    random_days=$((RANDOM % 365))
    project_date=$(date -d "-${random_days} days" "+%Y-%m-%d" 2>/dev/null || date -v-${random_days}d "+%Y-%m-%d")
    
    # Determine if featured (every 10th project)
    if [ $((i % 10)) -eq 0 ]; then
        featured="true"
    else
        featured="false"
    fi

    # Generate tags based on type
    case "$project_type" in
        "architecture")
            tags='["architecture", "design", "building", "modern", "sustainable"]'
            ;;
        "design")
            tags='["design", "branding", "visual", "creative", "digital"]'
            ;;
        "art")
            tags='["art", "installation", "interactive", "contemporary", "public"]'
            ;;
    esac

    # Create index.md with template content
    cat > "$PROJECT_DIR/index.md" << EOF
---
title: "$project_title"
date: "$project_date"
location: "$project_location"
coordinates: $project_coords
description: "A comprehensive project showcasing innovative design and creative solutions"
type: "$project_type"
tags: $tags
authors:
  - name: "Creative Director"
    role: "Lead Designer"
  - name: "Project Manager"
    role: "Coordinator"
featured: $featured
---

## Project Description

This project represents a significant achievement in contemporary $project_type, combining innovative design principles with functional requirements. The project showcases cutting-edge techniques and sustainable practices while maintaining aesthetic excellence.

## Design Concept

The design philosophy centers on creating harmonious relationships between form and function. Through careful consideration of spatial dynamics, material selection, and user experience, this project delivers a solution that exceeds expectations.

## Key Features

- Innovative design approach
- Sustainable materials and methods
- User-centered functionality
- Integration with environment
- Technical excellence

## Technical Implementation

The project required extensive collaboration between multidisciplinary teams to achieve the desired outcomes. Advanced techniques and technologies were employed to overcome challenges and deliver exceptional results.

## Project Outcomes

The completed project has received positive reception from users and critics alike, demonstrating the success of the design approach and implementation strategy. The project serves as a benchmark for future developments in the field.

## Impact and Recognition

This project has contributed to advancing the field of $project_type through its innovative approach and successful execution. It has been featured in various publications and has influenced subsequent projects in the industry.
EOF

    # Create images with unique seeds
    seed=$((i * 5 + 1))
    download_image "$PROJECT_DIR/thumbnail.jpg" 800 600 $seed "$project_title" "$project_color" "#ffffff"
    download_image "$PROJECT_DIR/images/main-view.jpg" 1200 800 $((seed + 1)) "Main View" "$project_color" "#ffffff"
    download_image "$PROJECT_DIR/images/detail-view.jpg" 1200 800 $((seed + 2)) "Detail View" "$project_color" "#ffffff"
    download_image "$PROJECT_DIR/images/context-view.jpg" 1200 800 $((seed + 3)) "Context View" "$project_color" "#ffffff"

    # Create documents
    create_pdf_placeholder "$PROJECT_DIR/documents/project-brief.pdf" "Project Brief"
    create_pdf_placeholder "$PROJECT_DIR/documents/technical-specs.pdf" "Technical Specifications"

    # Create videos for some projects
    if [ $((i % 3)) -eq 0 ]; then
        create_video_placeholder "$PROJECT_DIR/videos/overview.mp4" 120
    fi
done

echo ""
echo -e "${GREEN}✅ 100 example projects generated successfully!${NC}"
echo ""
echo "📁 Projects created in: $CONTENT_DIR/"
echo "   $(ls "$CONTENT_DIR" | wc -l) projects total"
echo ""
echo -e "${BLUE}🚀 Start your dev server: pnpm dev${NC}"