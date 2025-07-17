<p align="center">
  <img src="public/logo.png" alt="SnapMotion Logo" width="120" />
</p>

# SnapMotion

SnapMotion is a modern Next.js + TypeScript web application that lets users upload an image, generate a video using [fal.ai](https://fal.ai/) generative AI, and view extracted frames from the generated video.

---

## Features

- 🚀 Next.js 15 with App Router
- ⚡ TypeScript & React 19
- 🎨 Tailwind CSS styling & modern UI
- 🖼️ Image upload with preview and validation (PNG, JPEG, WEBP)
- 🤖 Video generation via fal.ai API (secure API key usage)
- 🖥️ Frame extraction from generated video using ffmpeg
- 🔒 Secure backend logic (API keys never exposed to client)
- 🗂️ Clean code structure with reusable components and services

---

## How It Works

1. **User uploads an image** (PNG, JPEG, or WEBP) via a modern, validated form.
2. **Backend API** receives the image, sends it to fal.ai for video generation using a custom prompt.
3. **Video is downloaded** to a temporary directory on the server.
4. **ffmpeg extracts a frame** from the video.
5. **Frontend displays the extracted frame(s)** to the user.

---

## Usage Flow

- **Upload an image** of a person, animal, toy, or digital character.
- **For best results:**
  - The subject should be clearly visible (not blurry)
  - Only one main object should be in focus
  - The background should not be too cluttered
- **Click "Generate New Frames"** and wait for the AI to process.
- **View the generated frame(s)** below the form.

---

---

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory and add your fal.ai API key and model:

FAL_API_KEY=your_fal_ai_api_key
FAL_VIDEO_GENERATION_MODEL=your_fal_ai_model_id

### 3. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Backend Details

- **API Route:** `/api/generate-frames` handles image upload, video generation, download, and frame extraction.
- **fal.ai Integration:** Uses secure API key from environment variables.
- **Video Download:** Video is saved to a temp directory using Node.js streams.
- **Frame Extraction:** Uses ffmpeg (must be installed on your server) to extract frames.

---

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [fal.ai](https://fal.ai/) (Generative AI API)
- [ffmpeg](https://ffmpeg.org/) (for frame extraction, must be installed on your server)

---

## Development Notes

- **API keys and secrets** are never exposed to the client.
- **All backend logic** (AI calls, video download, frame extraction) runs in API routes.
- **Frontend** is fully decoupled and only communicates with backend via fetch.

---

## License

MIT

---

**Made with ❤️ using Next.js, fal.ai, and ffmpeg**