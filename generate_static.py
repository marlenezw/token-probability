#!/usr/bin/env python3
"""
Script to generate static HTML files from Flask templates for GitHub Pages deployment.
This preserves the original Flask app for local development while creating a static demo.
"""

import os
import shutil
from flask import Flask
from app import app

def generate_static_site():
    """Generate static HTML files from Flask app"""
    
    # Ensure build directory exists
    build_dir = 'build'
    os.makedirs(build_dir, exist_ok=True)
    
    with app.test_client() as client:
        # Generate index.html
        response = client.get('/')
        if response.status_code == 200:
            with open(os.path.join(build_dir, 'index.html'), 'w', encoding='utf-8') as f:
                # Modify the HTML to work as a static site
                html_content = response.get_data(as_text=True)
                
                # Replace Flask URL generation with relative paths
                html_content = html_content.replace(
                    'href="{{ url_for(\'static\', filename=\'style.css\') }}"',
                    'href="static/style.css"'
                )
                # Use the static version of JavaScript for GitHub Pages
                html_content = html_content.replace(
                    'src="{{ url_for(\'static\', filename=\'script.js\') }}"',
                    'src="static/script-static.js"'
                )
                
                # Also handle any remaining Flask URL patterns
                html_content = html_content.replace('/static/', 'static/')
                
                f.write(html_content)
            print("✅ Generated index.html")
        else:
            print(f"❌ Error generating index.html: {response.status_code}")
    
    print("✅ Static site generation complete!")
    print("📁 Files created in build/ directory")
    print("🚀 Ready for GitHub Pages deployment")

if __name__ == '__main__':
    generate_static_site()
