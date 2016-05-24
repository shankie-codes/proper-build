#!/bin/bash


#jshon -e build -e source -u < /build/proper-config.json

# Find all stylesheets. Likely candidates for the Gulp project root
STYLESHEETS=()
while IFS=  read -r -d $'\0'; do
    STYLESHEETS+=($(echo "$REPLY" | sed 's/\/source\///'))
    # echo "$REPLY"
done < <(find /source/themes \( -name node_modules -prune \) -o -name "style.css" -print0 )
# find /source/themes \( -name node_modules -prune \) -o -name "style.css" | grep style.css

# echo "${STYLESHEETS[@]}"

# Give the user the option to add a custom path
STYLESHEETS+=("Custom...")
STYLESHEETS+=("Quit")

PS3="Your choice: "

select SOURCE_PATH in ${STYLESHEETS[@]}; do
  case $SOURCE_PATH in
    "Custom...")
       echo "Enter a custom path..."
       break
       ;;
    "Quit")
       exit
       ;;
    *)
      # Some other commands here for the 'else' case
      break
      ;;
  esac
done

echo "Creating proper-config.json with source path set as $SOURCE_PATH"

# Do a gulp.
# gulp scripts "$@"