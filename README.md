# BrighterBiz.ai - AI Use Case Recommender for Small Businesses

A web-based platform that enables small business owners to describe their business and receive tailored AI use case recommendations without requiring technical expertise or user accounts.

## 🚀 Features

- **Tailored Recommendations**: AI-powered suggestions specifically designed for your industry and business model
- **Easy to Understand**: Clear, actionable advice without technical jargon
- **Actionable Insights**: Specific tools and next steps, not just vague suggestions
- **No Signup Required**: Immediate value delivery through a friction-free experience
- **Mobile Responsive**: Fully responsive design for all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL) - *Optional for MVP*
- **AI Integration**: OpenAI GPT-4
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics (built-in)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brighterbiz-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
brighterbiz-ai/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
├── public/
├── package.json
└── README.md
```

## 🎯 MVP Features

### Phase 1: Core MVP ✅
- [x] Next.js application setup with Tailwind CSS
- [x] Landing page with all sections (hero, features, examples, footer)
- [x] Business input interface (text field + button)
- [ ] OpenAI integration for AI use case generation
- [ ] Results display page
- [ ] Vercel deployment pipeline

### Phase 2: Polish & Optimization
- [ ] shadcn/ui component integration optimization
- [ ] Mobile responsiveness testing
- [ ] Error handling and loading states
- [ ] Basic analytics with Vercel Analytics
- [ ] Performance optimization

### Phase 3: Launch Preparation
- [ ] Final UI/UX refinements
- [ ] Cross-browser testing
- [ ] Basic SEO optimization
- [ ] Domain setup and SSL
- [ ] Monitoring and logging setup

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

## 🌐 Deployment

The application is designed to be deployed on Vercel:

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

## 📊 Success Metrics

### Primary KPIs
- **Engagement Rate**: % of visitors who submit business description
- **Completion Rate**: % of users who receive AI recommendations successfully
- **Repeat Usage**: Users who try multiple business descriptions
- **Page Views**: Total landing page visits

## 🔒 Security & Privacy

- **No Personal Data Collection**: Strictly business operational data
- **Session-based Storage**: Temporary data with automatic expiration
- **API Security**: Secure OpenAI API key management
- **HTTPS Enforcement**: All connections encrypted

## 💰 Estimated Operating Costs (MVP)

- **Vercel Hosting**: $0-20/month (hobby/pro plan)
- **Supabase**: $0 (minimal/no database usage)
- **OpenAI API**: $30-100/month (based on usage)
- **Domain**: $10-15/year
- **Total Estimated**: $30-135/month

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@brighterbiz.ai or create an issue in this repository.

---

**BrighterBiz.ai** - Making AI accessible for small business owners everywhere.
