#CSS
##Sass

This folder should contain all of the Sass files for the site.  They are broken down as follows:

    `  |-sass` - root folder, would only include non underscored sass files, that would output css files
    `      |-base` - global styles, icons, reset/normalize. "Global" is files for things like: buttons, layout helpers, vendor style overrides (if applicable), typography
    `      |-pages` - styles for individual templates
    `      |-partials` - this would be specifically for any Sass files that don’t actually output any CSS
    `      |-ui-components` - modular pieces of css. Things like: header, footer, login panel, etc
    `      |-vendors` - anything from an external plugin or framework
