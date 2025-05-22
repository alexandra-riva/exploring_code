# VR Canvas Panel Project

## Phase 1: Basic WebXR Setup with Canvas Panel

### Features Implemented
- Three.js WebXR environment setup
- 320x180 canvas panel positioned in front of the user
- VR controller support with raycasting
- Meta Quest Emulator compatibility
- Raycasting activation only after entering VR mode

### Technical Details
- Canvas panel dimensions: 320x180 pixels (scaled to 3.2x1.8 meters in VR)
- Panel position: (0, 1.6, -2) - eye level, 2 meters in front
- Raycasting visualization with controller lines
- Event handling for controller interactions

### How to Run
1. Start a local server (using one of these commands):
   ```bash
   npx live-server --port=8080
   # or
   npx http-server
   ```
2. Open http://localhost:8080 in a WebXR-compatible browser
3. Click "Enter VR" to start the VR experience
4. Use Meta Quest Emulator controllers to interact with the canvas

### Project Structure
- `index.html` - Main HTML file with Three.js imports
- `main.js` - Core application logic and WebXR setup

### Initial Prompt
```
Create a three js file with Webxr feature. The scene should have a 320x180 canvas panel infront of me. 
I will use the scene for VR purpose. I already have the Meta Emulator plugin installed to test it in VR. 
I will use ray casting from the Emulator's controller to interact with the canvas. 
Only activate the raycasting after user clicks 'Enter VR'
```