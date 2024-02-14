Game Framework using p5.js

This is a simple game framework built using JavaScript and the p5.js library. It provides a flexible structure for creating games with components and animations.


Features

    Object-oriented structure for game development.
    Components system for organizing game elements.
    Tween animations for smooth transitions and effects.
    Support for sprites, shapes, and transformations.
    Scene management for switching between game screens.

Sure, here's a README file template for your JavaScript project using p5.js:
Game Framework using p5.js

This is a simple game framework built using JavaScript and the p5.js library. It provides a flexible structure for creating games with components and animations.
Table of Contents

    Features
    Getting Started
        Prerequisites
        Installation
    Usage
    Components
    Animations
    Examples
    Contributing
    License
    Acknowledgements

Features

    Object-oriented structure for game development.
    Components system for organizing game elements.
    Tween animations for smooth transitions and effects.
    Support for sprites, shapes, and transformations.
    Scene management for switching between game screens.

The framework includes several built-in components for game objects:

    ShapeRect: Represents a rectangular shape.
    ShapeCircle: Represents a circular shape.
    Sprite: Represents an image sprite.
    Transform: Manages position, scale, rotation, and skew of game objects.
    Deletor: Deletes game objects after a specified time.




Tween animations can be created using the Tween class. Simply specify the object, property, start value, end value, duration, and easing function.

let tween = new Tween(object, property, startValue, endValue, duration, easingFunction);
tween.start();


Acknowledgements

    Thanks to the p5.js community for creating a powerful library for creative coding.
    Inspired by various game development frameworks and engines.