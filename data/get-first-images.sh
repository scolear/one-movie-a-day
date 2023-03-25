#!/bin/bash

JSON_FILE="./data.json"
IMAGES_DIR="../images"
OUTPUT_DIR="$IMAGES_DIR/Output"

mkdir -p "$OUTPUT_DIR"

jq -c '.[]' "$JSON_FILE" | while read -r obj; do
  parent_pk=$(echo "$obj" | jq -r '.pk')

  resources=$(echo "$obj" | jq -c '.resources[]?')
  if [ -n "$resources" ]; then
    first_resource=$(echo "$resources" | jq -s '.[0]')
    first_image_filename=$(echo "$first_resource" | jq -r '.pk + ".jpg"')

    if [ -f "$IMAGES_DIR/$first_image_filename" ]; then
      cp "$IMAGES_DIR/$first_image_filename" "$OUTPUT_DIR/"
    fi
  else
    if [ -f "$IMAGES_DIR/$parent_pk.jpg" ]; then
      cp "$IMAGES_DIR/$parent_pk.jpg" "$OUTPUT_DIR/"
    fi
  fi
done
