#!/bin/bash

JSON_FILE="./data.json"
IMAGES_DIR="../images"
UNSORTED_DIR="$IMAGES_DIR/Unsorted"

mkdir -p "$UNSORTED_DIR"

# Move all images to Unsorted folder initially
mv "$IMAGES_DIR"/*.jpg "$UNSORTED_DIR"

jq -c '.[]' "$JSON_FILE" | while read -r obj; do
  parent_pk=$(echo "$obj" | jq -r '.pk')
  mkdir -p "$IMAGES_DIR/$parent_pk"

  if [ -f "$UNSORTED_DIR/$parent_pk.jpg" ]; then
    mv "$UNSORTED_DIR/$parent_pk.jpg" "$IMAGES_DIR/$parent_pk/"
  fi

  resources=$(echo "$obj" | jq -c '.resources[]?')
  if [ -n "$resources" ]; then
    echo "$resources" | while read -r resource; do
      image_filename=$(echo "$resource" | jq -r '.pk + ".jpg"')

      if [ -f "$UNSORTED_DIR/$image_filename" ]; then
        mv "$UNSORTED_DIR/$image_filename" "$IMAGES_DIR/$parent_pk/"
      fi
    done
  fi
done
