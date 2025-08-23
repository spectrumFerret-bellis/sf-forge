# Brian

1. Gets playlist channels from radio_conventional_receive_channels and radio_trunking_receive_channels
2. Fetches actual channel details for each receive channel
3. Fetches transmissions for all channels in one call using the search endpoint
4. Distributes transmissions to their respective channels
5. The transmission count is simply the length of the transmissions array for each channel. Let me update the usePlaylistChannels hook to follow this pattern:

Great question! Looking at your current implementation and the sf-echo pattern, I'd recommend **implementing the TanStack Query calls at the page orchestration level** (`index.tsx`) rather than in individual components. Here's why:

## **Recommended Approach: Page-Level Data Fetching**

### **Why Page-Level is Better:**

1. **Single Source of Truth**: All API calls managed in one place
2. **Better Error Handling**: Centralized error states and retry logic
3. **Performance**: Avoid multiple components making the same API calls
4. **State Management**: Easier to share data between components
5. **Testing**: Easier to test data flow and component isolation

### **Current sf-echo Pattern:**
The sf-echo Timeline component shows this pattern:
```typescript
// Page level - data fetching
const [playlists, setPlaylists] = useState<Playlist[]>([]);
useEffect(() => {
  fetchPlaylists().then(setPlaylists);
}, []);

// Pass data as props to components
<PlaylistSelector
  playlists={playlists}
  selected={selectedPlaylist}
  onSelect={(pl: Playlist) => dispatch(populateFromPlaylists({ playlists: [pl] }))}
/>
```

## **Recommended Implementation for sf-forge:**

### **1. Update PageHome (index.tsx)**
```typescript
import { usePlaylists } from '@/hooks/api'

export function PageHome() {
  // Data fetching at page level
  const { data: playlists, isLoading, error } = usePlaylists()
  
  return (
    <div className={CSS_WRAPPER}>
      <LayoutNav />
      <div className={CSS_CONTENT}>
        <LayoutRowCollapsible title="Config" className="mb-2">
          <Playlist 
            playlists={playlists?.radio_playlists || []}
            isLoading={isLoading}
            error={error}
            className="flex-1 max-w-full" 
          />
          <Channels className="flex-1 max-w-full" />
          <TimeRange className="flex-1 max-w-full" />
        </LayoutRowCollapsible>
        {/* ... rest of components */}
      </div>
    </div>
  )
}
```

### **2. Update Playlist Component**
```typescript
interface PlaylistProps {
  playlists: RadioPlaylist[]
  isLoading?: boolean
  error?: Error | null
  className?: string
}

export function Playlist({ playlists, isLoading, error, className }: PlaylistProps) {
  if (isLoading) return <PlaylistLoading />
  if (error) return <PlaylistError error={error} />
  if (!playlists || playlists.length === 0) return <PlaylistEmpty />
  
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Playlist</CardTitle>
      </CardHeader>
      <CardContent>
        <PlaylistPresent playlists={playlists} />
      </CardContent>
    </Card>
  )
}
```

## **Benefits of This Approach:**

### **✅ Advantages:**
- **Centralized Data Management**: All API calls in one place
- **Better Error Boundaries**: Handle errors at page level
- **Component Reusability**: Components become pure presentation components
- **Easier Testing**: Mock data at page level, test components in isolation
- **Performance**: Avoid duplicate API calls
- **State Sharing**: Easy to share data between sibling components

### **❌ Disadvantages of Component-Level:**
- **Multiple API Calls**: Each component might fetch the same data
- **Harder to Share State**: Components can't easily share fetched data
- **Complex Error Handling**: Each component needs its own error handling
- **Testing Complexity**: Need to mock API calls for each component

## **Migration Strategy:**

1. **Move API calls to page level** (`index.tsx`)
2. **Pass data as props** to components
3. **Add loading/error states** at page level
4. **Update components** to be pure presentation components
5. **Add TypeScript interfaces** for all props

This follows the same pattern as sf-echo and is considered a React best practice for data fetching in component hierarchies.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
