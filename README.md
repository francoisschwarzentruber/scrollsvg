# scrollSVG

Make animated SVG when scrolling. This tool may be used for instance for making comics (sort of webtoons), animated written notes for courses. The tool loads an almost standard SVG file  via the URL parameter file. It then displays the SVG by taking into account some specific annotations to perform animations when the SVG is scrolled. The idea is that the SVG contains both the graphics and the timeline of events. The timeline contains typically rectangles with specific annotations to describe animations.

## Features

- slow down in some parts of the SVG. In order to give attention to the actions that are occurring
- make some part of visible/invisible depending on how much the user scrolled
- make animations such as translations, rotations when the user is scrolling

## Examples

- Le corbeau et le renard. Jean de la Fontaine https://francoisschwarzentruber.github.io/scrollsvg?file=examples/le_corbeau_et_le_renard.svg


## Roadmap

This tool is work in progress. To be done: 
- responsive on smartphones
- animations that follow a path
- changes of colors, sizes
