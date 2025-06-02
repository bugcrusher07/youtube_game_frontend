// import { Injectable } from "@angular/core";

// @Injectable({ providedIn: 'root' })
// export class InputService {
//   private keyStates = new Map<string, boolean>();
//   private mousePosition = { x: 0, y: 0 };

//   constructor() {
//     this.setupListeners();
//   }

//   private setupListeners() {
//     // Keyboard
//     window.addEventListener('keydown', (e) => this.keyStates.set(e.key, true));
//     window.addEventListener('keyup', (e) => this.keyStates.set(e.key, false));

//     // Mouse
//     window.addEventListener('mousemove', (e) => {
//       this.mousePosition = { x: e.clientX, y: e.clientY };
//     });
//   }

//   isKeyPressed(key: string): boolean {
//     return this.keyStates.get(key) || false;
//   }

//   getMousePosition() {
//     return this.mousePosition;
//   }
// }