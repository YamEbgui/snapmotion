<p align="center">
  <img src="public/logo.png" alt="SnapMotion Logo" width="120" />
</p>

# SnapMotion 🎬✨

Transform static images into dynamic video frames with AI-powered pose transformation and automated quality scoring.

## 🌟 Features

- **AI Video Generation**: Convert images to dynamic video using fal.ai
- **Frame Extraction**: Extract high-quality frames using FFmpeg
- **Automatic Quality Scoring**: AI-powered frame quality assessment using OpenAI GPT-4 Vision
- **Cloud Storage**: Secure S3 storage with presigned URLs
- **Modern UI/UX**: Beautiful, responsive interface with animations
- **Real-time Processing**: Live updates with comprehensive logging

## 🎯 New AI Quality Scoring

SnapMotion now includes automated quality assessment for generated frames:

- **OpenAI Integration**: Uses GPT-4 Vision to compare original vs generated frames
- **Decimal Scoring**: Returns scores from 0.0 to 1.0 for quality assessment
- **Detailed Reasoning**: AI provides explanations for scoring decisions
- **Automatic Sorting**: Frames are automatically ranked by quality score

### Quality Score Interpretation:
- **0.9-1.0**: Excellent quality, very similar to original
- **0.7-0.8**: Good quality, maintains essence well
- **0.5-0.6**: Average quality, moderate similarity
- **0.3-0.4**: Below average, noticeable differences
- **0.0-0.2**: Poor quality, significant differences

## 🚀 Tech Stack

**Frontend:**
- Next.js 15 with App Router
- React 19 with Server Components
- TypeScript for type safety
- Tailwind CSS v4 for styling

**Backend:**
- fal.ai for AI video generation
- OpenAI GPT-4 Vision for quality scoring
- FFmpeg for frame extraction
- AWS S3 for file storage

**Infrastructure:**
- AWS App Runner for deployment
- AWS ECR - Container registry for Docker images
- Terraform for Infrastructure as Code
- GitHub Actions for CI/CD

## 📡 API Endpoints

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

### Compare Images (New)
```http
POST /api/compare-images
Content-Type: application/json

{
  "originalImageUrl": "https://...",
  "generatedFrameUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 0.75,
    "reasoning": "Good visual similarity with minor pose differences",
    "operationId": "op_123456",
    "processingTimeMs": 2500
  }
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
AWS_BUCKET_NAME=your-s3-bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## 🏗️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snapmotion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # Note: You'll need to install the OpenAI SDK
   npm install openai
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and AWS credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎨 UI/UX Highlights

- **Glass Morphism Design**: Modern frosted glass effects
- **Drag & Drop Upload**: Intuitive file upload experience
- **Real-time Previews**: Instant image previews with metadata
- **Quality Indicators**: Visual scoring system for generated frames
- **Staggered Animations**: Smooth, professional transitions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Loading States**: Comprehensive progress indicators
- **Error Handling**: User-friendly error messages

## 📁 Component Architecture

```
src/app/
├── components/
│   ├── HomePage.tsx           # Main application logic
│   ├── MainContent.tsx        # Unified content container
│   ├── ExplanationSection.tsx # Feature description
│   ├── UploadSection.tsx      # File upload interface
│   ├── FramesViewer.tsx       # Generated frames display
│   ├── Header.tsx             # Application header
│   ├── BulletPoint.tsx        # Reusable bullet component
│   └── TipPoint.tsx           # Reusable tip component
├── api/
│   ├── generate-frames/       # Main processing endpoint
│   ├── compare-images/        # New AI comparison endpoint
│   ├── services/              # Backend services
│   │   ├── openAIService.ts   # New OpenAI integration
│   │   ├── falIntegration.ts  # fal.ai video generation
│   │   ├── framesExtraction.ts # FFmpeg processing
│   │   ├── uploadImage.ts     # S3 upload handling
│   │   └── downloadVideo.ts   # Video download utility
│   └── lib/
│       ├── logger.ts          # Centralized logging
│       └── s3Service.ts       # AWS S3 operations
└── types/
    └── Frame.ts               # Enhanced with scoring
```

## 🔒 Security Features

- **Presigned URLs**: Secure, time-limited S3 access
- **Input Validation**: File type and size verification
- **Error Sanitization**: Safe error message exposure
- **Environment Isolation**: Secure credential management
- **CORS Configuration**: Proper cross-origin handling

## ⚡ Performance Optimizations

- **Concurrent Processing**: Parallel frame generation
- **Lazy Loading**: On-demand component loading
- **Image Optimization**: Next.js automatic optimization
- **Caching Strategy**: Efficient resource management
- **Bundle Splitting**: Optimized code delivery

## 📊 Monitoring & Logging

The application includes comprehensive logging throughout the backend:

- **Request Tracking**: Full request lifecycle monitoring
- **Performance Metrics**: Processing time measurements
- **Error Logging**: Detailed error context and stack traces
- **OpenAI Usage**: Token usage and API call monitoring
- **Resource Cleanup**: File system operation tracking

## 🚢 Deployment

### Container Workflow
1. **Build**: GitHub Actions builds Docker image
2. **Push**: Image pushed to AWS ECR
3. **Deploy**: App Runner pulls from ECR and deploys

### Infrastructure
All infrastructure is managed via Terraform:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, OpenAI, fal.ai, and AWS**


