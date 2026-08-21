# Parametric Product Configurator

A modern, dark-themed parametric product configurator built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **ShapeDiver Viewer**.

![Configurator Screenshot](./docs/screenshot.png)

## Features

- 🔐 **Authentication** - Email/password auth via Supabase (login, signup, password reset)
- 📊 **User Dashboard** - Model selection, preset management, profile settings
- 💾 **Cloud Presets** - Save and sync presets across devices (Supabase)
- ⭐ **Favorites** - Mark presets as favorites for quick access
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
- 💾 **Preset System** - Save and load parameter configurations (synced to Supabase)
- 🔗 **Share URL** - Generate shareable links with current configuration

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Viewer:** @shapediver/viewer
- **Auth & Database:** Supabase (@supabase/ssr, @supabase/supabase-js)
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

2. Configure environment variables:

```bash
# Copy the example environment file
cp .env.example .env.local
```

3. Edit `.env.local` with your credentials:

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

# Supabase (required for auth and presets)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up Supabase (for auth and presets):

- Create a project at [Supabase Dashboard](https://supabase.com/dashboard)
- Run migrations in `supabase/migrations/` (see [supabase/README.md](supabase/README.md)):
  - `20250126000000_create_profiles.sql`
  - `20250126100000_create_presets.sql`
- In Supabase Auth settings, add your redirect URLs (e.g. `http://localhost:3000/auth/callback`)
- (Optional) Customize email templates in Supabase Dashboard: Authentication > Email Templates (e.g. Confirm signup, Reset password)

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Auth Flow

- **Signup** → Supabase sends a confirmation email. User must verify before first login.
- **Login** → Redirects to Dashboard
- **Dashboard** → Select a model to open the configurator
- **Presets** → Saved to Supabase, synced across devices
- **Settings** → Update profile (name, avatar URL)

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
│   │   ├── auth/              # Auth actions, callback
│   │   ├── configurator/      # 3D configurator page
│   │   ├── dashboard/        # User dashboard
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── settings/         # Profile settings
│   │   ├── presets/           # Preset server actions
│   │   └── ...
│   ├── components/
│   │   ├── ShapeDiverViewer.tsx  # Main viewer + session management
│   │   ├── PresetSelector.tsx    # Preset CRUD (Supabase)
│   │   ├── ParameterPanel.tsx    # Grouped parameter list
│   │   └── ...
│   ├── lib/
│   │   ├── config.ts          # ShapeDiver configuration
│   │   └── supabase/          # Supabase client (browser, server, middleware)
│   └── types/
├── supabase/
│   └── migrations/            # SQL migrations (profiles, presets)
├── .env.example
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
