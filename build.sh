#!/bin/bash
# Build inline HTML files from source files
# Each page gets CSS + JS inlined so it works standalone

CSS_FILE="css/style.css"
JS_FILE="js/main.js"
DIST_DIR="dist"

cd "$(dirname "$0")"

mkdir -p "$DIST_DIR/pages"

CSS_CONTENT=$(cat "$CSS_FILE")
JS_CONTENT=$(cat "$JS_FILE")

build_page() {
  local src="$1"
  local dest="$2"

  # Read the source file
  local content=$(cat "$src")

  # Replace external CSS link with inline style
  content=$(echo "$content" | sed '/<link rel="stylesheet"/d')

  # Replace </head> with <style>CSS</style></head>
  # Using a temp file approach to handle large content
  local tmpfile=$(mktemp)
  echo "$content" > "$tmpfile"

  # Build output
  {
    # Everything before </head>
    sed -n '1,/<\/head>/{ /<\/head>/!p }' "$tmpfile"
    echo "<style>"
    cat "$CSS_FILE"
    echo "</style>"
    echo "</head>"
    # Everything after </head> but before </body>
    sed -n '/<\/head>/,/<\/body>/{ /<\/head>/!{ /<\/body>/!p } }' "$tmpfile"
    echo "<script>"
    cat "$JS_FILE"
    echo "</script>"
    echo "</body>"
    echo "</html>"
  } > "$dest"

  rm -f "$tmpfile"
  echo "Built: $dest"
}

# Build index
build_page "index.html" "$DIST_DIR/index.html"

# Build pages
for page in pages/*.html; do
  local_name=$(basename "$page")
  build_page "$page" "$DIST_DIR/pages/$local_name"
done

echo "Done! All files in $DIST_DIR/"
