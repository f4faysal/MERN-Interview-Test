# BlackBoard Project Documentation

## Overview

The BlackBoard project is a web-based drawing application built using React. It allows users to create, edit, and manipulate drawings on a canvas. The application supports various drawing tools, including pencils, brushes, erasers, and shapes, and provides features such as color selection, line width adjustment, and element manipulation.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)
4. [Components](#components)
5. [Functions](#functions)
6. [Dependencies](#dependencies)
7. [Usage Example](#usage-example)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/f4faysal/MERN-Interview-Test.git
   ```

2. Navigate to the project directory:

   ```bash
   cd MERN-Interview-Test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and visit [https://f4black-board.vercel.app/](https://f4black-board.vercel.app/).

3. Use the drawing tools and features on the canvas.

## Features

- **Drawing Tools:**

  - Pencil
  - Eraser
  - Shapes (e.g., rectangles, )

- **Tool Customization:**

  - Color white selection
  - Line width adjustment

- **Element Manipulation:**

  - Selection of drawn elements

- **Responsive Design:**
  - Canvas adapts to the window size

## Components

1. **Swatch:**

   - Manages tool selection, color, and line width settings.

2. **element.js:**

   - Contains functions for creating, adjusting, and manipulating drawing elements.

3. **Swatch:**

   - Manages tool selection, color, and line width settings.

4. **BlackBoard:**
   - Main component handling the canvas, drawing logic, and user interactions.

## Functions

1. **createElement:**

   - Creates a new drawing element with specified properties.

2. **adjustElementCoordinates:**

   - Adjusts the coordinates of a drawing element.

3. **midPointBtw:**

   - Calculates the midpoint between two points.

4. **resizedCoordinates:**

   - Calculates the new coordinates when resizing a drawing element.

5. **getElementAtPosition:**
   - Retrieves the drawing element at a specific position.

## Dependencies

- **React:** JavaScript library for building user interfaces.
- **roughjs:** Library for creating hand-drawn-like graphics.

## Usage Example

```jsx
import React from "react";
import BlackBoard from "./BlackBoard";

function App() {
  return (
    <div>
      <BlackBoard />
    </div>
  );
}

export default App;
```

## Future Enhancements

1. **Undo/Redo Functionality:**

   - Implement the ability to undo and redo drawing actions.

2. **Save/Load Drawings:**

   - Allow users to save their drawings and load them later.

3. **Additional Drawing Tools:**

   - Expand the range of drawing tools and customization options.

4. **User Authentication:**
   - Add user authentication to save drawings on a per-user basis.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
