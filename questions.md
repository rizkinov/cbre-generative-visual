I have a few clarifying questions to ensure I build this exactly as you want:

1.  **"Mirroring" vs "Direction"**:
    When you say "each split user be able to choose the mirroring", do you mean:
    *   **Option A**: Reversing the **Direction** (e.g., changing Split 2 from "Left-to-Right" to "Right-to-Left")? This matches your description of the default behavior.
    *   **Option B**: The **Reflection** effect we just added (where the pattern mirrors in the middle, e.g., "Horizontal Mirror")?
    *   **Option C**: Both? (User can choose to reverse direction AND/OR apply the reflection effect).

2.  **Split Orientation**:
    Based on your image, it looks like:
    *   If the pattern is **Vertical Bars** (Left-to-Right), the splits are stacked **Vertically** (creating rows).
    *   If the pattern is **Horizontal Bars** (Top-to-Bottom), the splits would be stacked **Horizontally** (creating columns).
    Is this correct?

3.  **Controls**:
    To keep it simple, I propose:
    *   A "Split Count" selector (1, 2, 3, 4).
    *   When Split Count > 1, show a section for each extra split (Split 2, Split 3, etc.).
    *   Each section will have:
        *   **Color Picker** (for foreground).
        *   **Mirror/Reverse Toggle** (depending on your answer to #1).
    Does this sound right?
