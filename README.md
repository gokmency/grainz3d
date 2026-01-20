# Parametric Product Configurator

A modern, dark-themed parametric product configurator built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **ShapeDiver Viewer**.

![Configurator Screenshot](./docs/screenshot.png)

## Features

- 🎨 **Dynamic Parameter UI** - Automatically generates the correct input type for each parameter:
  - **Number (Int/Float)** → Range Slider
  - **Boolean** → Toggle Switch
  - **StringList** → Dropdown Select
  - **Color** → Color Picker
  - **String** → Text Input
- 🔄 **Real-time Updates** - Debounced parameter changes for smooth 3D updates
- 📱 **Responsive Layout** - Left sidebar for controls, main area for 3D viewport
- 🌙 **Dark Theme** - Minimalist "Indie Hacker" aesthetic with dark grays and clean typography
- ⚡ **SSR Compatible** - Properly handles client-side only ShapeDiver viewer
- 🔀 **Multi-Model Support** - Switch between multiple ShapeDiver models via environment variables
- 📸 **Screenshot Export** - Download high-quality PNG screenshots
- 🌍 **Environment Maps** - Multiple lighting environments (Studio, Nature, Urban, etc.)
- 💾 **Preset System** - Save and load parameter configurations
- 🔗 **Share URL** - Generate shareable links with current configuration

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Viewer:** @shapediver/viewer
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- A ShapeDiver account with an uploaded Grasshopper model

### Installation

1. Clone or copy this project:

```bash
cd shapediver-configurator
npm install
```

2. Configure your ShapeDiver credentials:

```bash
# Copy the example environment file
cp .env.example .env.local
```

3. Edit `.env.local` with your ShapeDiver credentials:

**Single Model Setup:**
```env
NEXT_PUBLIC_SHAPEDIVER_TICKET=your-ticket-here
NEXT_PUBLIC_SHAPEDIVER_MODEL_VIEW_URL=https://sdr8euc1.eu-central-1.shapediver.com
NEXT_PUBLIC_SHAPEDIVER_MODEL_NAME=My Model
```

**Multiple Models Setup:**
```env
# Model 1
NEXT_PUBLIC_SHAPEDIVER_MODEL_1_NAME=Chair Configurator
NEXT_PUBLIC_SHAPEDIVER_MODEL_1_TICKET=your-model-1-ticket
NEXT_PUBLIC_SHAPEDIVER_MODEL_1_URL=https://sdrXXXX.eu-central-1.shapediver.com
NEXT_PUBLIC_SHAPEDIVER_MODEL_1_DESCRIPTION=Customize your perfect chair

# Model 2
NEXT_PUBLIC_SHAPEDIVER_MODEL_2_NAME=Table Designer
NEXT_PUBLIC_SHAPEDIVER_MODEL_2_TICKET=your-model-2-ticket
NEXT_PUBLIC_SHAPEDIVER_MODEL_2_URL=https://sdrXXXX.eu-central-1.shapediver.com
NEXT_PUBLIC_SHAPEDIVER_MODEL_2_DESCRIPTION=Design your custom table

# Add up to 10 models (MODEL_3, MODEL_4, etc.)
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Finding Your ShapeDiver Credentials

1. Go to [ShapeDiver Platform](https://www.shapediver.com/app/)
2. Log in and open your model
3. Click **"Edit"** on your model
4. Go to the **"Developers"** tab
5. Under **"Backend Access"**, click "Enable backend access" if not already enabled
6. In the **"Embedding"** section, find:
   - **TICKET** = The "Ticket for embedding" value (also called Model View ID)
   - **MODEL_VIEW_URL** = The "Model view URL" (e.g., `https://sdr8euc1.eu-central-1.shapediver.com`)

### Important: Domain Allowlist

Make sure to add your development domain (e.g., `localhost`) to the **"Allowed domains"** list in the ShapeDiver dashboard for the embedding to work!

## Project Structure

```
shapediver-configurator/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles + custom scrollbar
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page (dynamic import for SSR)
│   ├── components/
│   │   ├── ShapeDiverViewer.tsx  # Main viewer + session management
│   │   ├── ParameterPanel.tsx    # Grouped parameter list
│   │   ├── ParameterInput.tsx    # Dynamic input components
│   │   └── index.ts
│   ├── hooks/
│   │   └── useDebounce.ts     # Debounce utility for updates
│   ├── lib/
│   │   └── config.ts          # ShapeDiver configuration
│   └── types/
│       └── shapediver.ts      # TypeScript types
├── .env.example               # Example environment variables
├── .env.local                 # Your local configuration (gitignored)
└── README.md
```

## How It Works

### 1. Viewer Initialization

The `ShapeDiverViewer` component:
- Creates a viewport attached to a canvas element
- Opens a session with your ShapeDiver model
- Fetches all available parameters from the model
- Filters out hidden parameters and sorts by order

### 2. Dynamic Parameter UI

The `ParameterInput` component reads the parameter's `type` property and renders:
- `Bool` → Toggle switch
- `Int`, `Float`, `Even`, `Odd` → Range slider with min/max
- `Color` → Color picker with hex input
- `StringList` → Dropdown select
- Parameters with `choices` array → Dropdown select
- Other `String` types → Text input

### 3. Update Mechanism

When a user changes a parameter:
1. The value is immediately set on the parameter object
2. A debounced (300ms) customization request is triggered
3. ShapeDiver processes the update and returns new geometry
4. The 3D viewport automatically updates

## Customization

### Styling

Edit `src/app/globals.css` for:
- Custom scrollbars
- Range slider thumb styles
- Color picker appearance
- Focus states

### Parameter Groups

Parameters are automatically grouped by their `group.name` property. The "General" group appears first, followed by other groups sorted alphabetically.

### Debounce Delay

Adjust the debounce delay in `ShapeDiverViewer.tsx`:

```typescript
const debouncedCustomize = useCallback(
  debounce(async () => {
    // ...
  }, 300), // Change this value (milliseconds)
  []
);
```

## API Reference

### ShapeDiver Viewer

The project uses the official `@shapediver/viewer` package. Key APIs used:

- `createViewport()` - Creates the 3D rendering viewport
- `createSession()` - Connects to a ShapeDiver model
- `session.parameters` - Object containing all model parameters
- `parameter.value` - Get/set parameter value
- `session.customize()` - Trigger geometry update

For full documentation, see:
- [ShapeDiver Viewer Documentation](https://help.shapediver.com/doc/viewer)
- [Viewer API Reference](https://viewer.shapediver.com/v3/latest/api/index.html)

## License

MIT
