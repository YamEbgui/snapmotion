<p align="center">
  <img src="public/logo.png" alt="SnapMotion Logo" width="120" />
</p>

# SnapMotion 

SnapMotion turns your static images into dynamic video and extract frames with cutting-edge AI.  
Simply upload an image to instantly preview and download high-quality frames.  
Experience a sleek, responsive interface with drag-and-drop support and real-time feedback.  
All processing and storage are handled securely and scalably in the cloud.

## Features

- **AI Video Generation**: Convert images to dynamic video using fal.ai.
- **Frame Extraction**: Extract high-quality frames using FFmpeg.
- **Automatic Quality Scoring**: Assess frame quality with AI.
- **Cloud Storage**: Secure S3 storage with presigned URLs.
- **Modern UI/UX**: Beautiful, responsive interface with animations.
- **Download Frames**: Download images after previewing them.
- **Drag & Drop**: Drag and drop images directly into the app.

## AI Quality Scoring

SnapMotion now includes automated quality assessment for generated frames:

- **OpenAI Integration**: Uses GPT-4.1 to compare original vs generated frames

## Tech Stack

**Frontend:**
- Next.js
- React with Server Components
- TypeScript for type safety
- Tailwind CSS v4 for styling

**Backend:**
- fal.ai for AI video generation
- OpenAI GPT-4.1 for quality scoring
- FFmpeg for frame extraction
- AWS S3 for file storage

**Infrastructure:**
- S3 for Terraform state storage and image storage
- AWS IAM for communication with S3
- AWS App Runner for deployment
- AWS ECR for container registry of Docker images
- Terraform for Infrastructure as Code
- GitHub Actions for CI/CD

## API Endpoints

### Generate Frames
```http
POST /api/generate-frames
Content-Type: multipart/form-data

{
  "image": File
}
```

**Response:**
```json
{
  "frames": [
    {
      "url": "https://s3-presigned-url...",
      "score": 0.85,
      "reasoning": "High quality frame with good pose variation..."
    }
  ]
}
```

## 🔧 Environment Variables

```env
# fal.ai Configuration
FAL_API_KEY=your_fal_api_key
FAL_VIDEO_GENERATION_MODEL=fal-ai/stable-video-diffusion

# OpenAI Configuration (New)
OPENAI_API_KEY=your_openai_api_key

# AWS Configuration
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-s3-bucket # Of Bucket created by terraform
AWS_ACCESS_KEY_ID=your_access_key # Of IAM user created by terraform
AWS_SECRET_ACCESS_KEY=your_secret_key # Of IAM user created by terraform
```

## UI/UX Highlights

- **Glass Morphism Design**: Modern frosted glass effects
- **Drag & Drop Upload**: Intuitive file upload experience
- **Real-time Previews**: Instant image previews with metadata
- **Quality Indicators**: Visual scoring system for generated frames
- **Staggered Animations**: Smooth, professional transitions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Loading States**: Comprehensive progress indicators
- **Error Handling**: User-friendly error messages

## Component Architecture

```
src/app/
├── components/
│   ├── HomePage.tsx            # Main application logic
│   ├── MainContent.tsx         # Unified content container
│   ├── ExplanationSection.tsx  # Feature description
│   ├── UploadSection.tsx       # File upload interface
│   ├── FramesViewer.tsx        # Generated frames display
│   ├── Header.tsx              # Application header
│   ├── BulletPoint.tsx         # Reusable bullet component
│   └── TipPoint.tsx            # Reusable tip component
├── api/
│   ├── generate-frames/        # Main processing endpoint
│   ├── services/               # Backend services
│   │   ├── openAIService.ts    # New OpenAI integration
│   │   ├── falIntegration.ts   # fal.ai video generation
│   │   ├── framesExtraction.ts # FFmpeg processing
│   │   ├── uploadImage.ts      # S3 upload handling
│   │   └── downloadVideo.ts    # Video download utility
│   └── lib/
│       ├── logger.ts           # Centralized logging
│       └── s3Service.ts        # AWS S3 operations
└── types/
    └── Frame.ts                # Enhanced with scoring
```

## Security Features

- **Presigned URLs**: Secure, time-limited S3 access
- **Input Validation**: File type and size verification
- **Error Sanitization**: Safe error message exposure
- **Environment Isolation**: Secure credential management


## Deployment
The application is deployed using GitHub Actions and AWS App Runner. Here's the workflow:

### Container Workflow
1. **Build**: GitHub Actions builds Docker image
2. **Push**: Image pushed to AWS ECR
3. **Deploy**: App Runner pulls from ECR automatically and deploys

### Infrastructure
All infrastructure is managed via Terraform except for app runner that change configuration after deployment.
First image on ecr need to be deployed to ecr before app runner can be deployed.

### Disclaimers
This project has a variety of areas that can be improved, and several came to my mind as I was developing it. Here are a few examples:
1. The project uses an AWS role instead of a user, which is not best practice, but was done to enable deployment to Vercel, for example.
2. Error handling does not follow best practices and is a work in progress.
3. The app has not been tested on different devices and browsers, though it is designed to look good on mobile as well.
4. Tests are missing and type definitions are not perfect.
5. The frontend component structure can be improved.
6. Key features such as authentication, user management, and others are missing.




