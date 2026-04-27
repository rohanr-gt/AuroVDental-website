# 🦷 SmileVista Dental - Premium Dental Website

A modern, fully-featured dental website built with **React**, **Node.js**, and **Tailwind CSS**. Features AI-powered smile preview, appointment booking, treatment recommendations, and more.

## ✨ Features

- 🎯 **Service Pages** - Smile Designing, Aligners, Implants
- 📸 **AI Smile Preview** - Upload and preview smile transformations
- 📋 **Smart Assessment** - Treatment recommendation quiz
- 📅 **Booking System** - Appointment scheduling with calendar
- 🖼️ **Before & After Gallery** - Results showcase with filters
- 💬 **Chatbot** - 24/7 AI-powered support
- 🌍 **Multi-Language** - English, Spanish, French
- ❓ **Smart FAQ** - Searchable knowledge base
- 💚 **WhatsApp Integration** - Direct messaging support
- 📱 **Fully Responsive** - Works on all devices
- 🔍 **SEO Optimized** - Meta tags and structured data

## 🚀 Quick Start (Clone & Run)

Setting up the project is now fully automated. Follow these steps to get started:

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** installed and running on your machine

### 2. Install & Auto-Initialize
Run the following command in the project root. This will install dependencies, **automatically create your `.env` file**, and build the frontend:
```bash
npm install
```

### 3. Database Configuration
By default, the app looks for MySQL on `localhost` with user `root` and password `root`. 
- If your MySQL credentials are different, open the **`.env`** file and update `MYSQL_USER` and `MYSQL_PASSWORD`.
- **Note**: You do NOT need to create the database or tables manually; the app handles this on startup.

### 4. Run the Application
Start both the frontend and backend with one command:
```bash
npm run dev
```
Open **http://localhost:5000** in your browser to view the site!

## 📁 Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── contexts/       # Context for multi-language
│   └── styles/         # Global CSS
├── server/             # Node.js API
├── database/           # SQL schema
└── package.json        # Dependencies
```

## 🎨 Key Pages

| Page | URL | Features |
|------|-----|----------|
| Home | `/` | Hero, services overview |
| Smile Designing | `/smile-designing` | Service details, benefits |
| Aligners & Braces | `/aligners-braces` | Treatment information |
| Dental Implants | `/dental-implants` | Implant details |
| AI Preview | `/ai-preview` | Upload and preview smile |
| Assessment | `/assessment` | 5-step quiz |
| Results | `/results` | Before & after gallery |
| FAQ | `/faq` | Searchable questions |
| Booking | `/booking` | Appointment form |

## 🔧 API Endpoints

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/available-slots` - Get time slots

### Treatment
- `POST /api/recommend-treatment` - Get recommendations
- `POST /api/smile-preview` - Process smile image

### Content
- `GET /api/gallery` - Get before/after images
- `GET /api/faqs` - Get FAQ list
- `GET /api/translations/:lang` - Get translations

### Support
- `POST /api/chat` - Chat with AI

## 🎯 How to Use

### For Users
1. Visit homepage to explore services
2. Take assessment quiz for recommendations
3. Book appointment with calendar
4. Chat with AI assistant anytime
5. Switch language in navbar
6. Share before/after results

### For Developers
1. Add new API endpoints in `server/server.js`
2. Create new pages in `src/pages/`
3. Add components in `src/components/`
4. Update styles in `src/styles/index.css`
5. Add translations in `src/contexts/LanguageContext.jsx`

## 📦 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 6
- **Backend**: Express.js
- **Scheduling**: Node Cron
- **HTTP**: Axios + CORS

## 🌐 Languages Supported

- 🇺🇸 English
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)

## 📱 Responsive Design

✅ Mobile (< 640px)  
✅ Tablet (640px - 1024px)  
✅ Desktop (> 1024px)  

## 🔐 Security Notes

For production, add:
- HTTPS/SSL
- Authentication system
- Rate limiting
- Input validation
- CORS restrictions
- Environment variables

## 📊 SEO Features

- ✅ Meta tags and descriptions
- ✅ Open Graph for social sharing
- ✅ Twitter Card support
- ✅ JSON-LD structured data
- ✅ Mobile viewport optimization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- Vercel (Recommended for React)
- Netlify
- AWS Amplify
- Heroku (for backend)

## 📚 Documentation

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for:
- Complete feature breakdown
- Database schema
- API documentation
- Testing checklist
- Production setup

## 🆘 Support Features

- **Chatbot**: Available 24/7 in bottom-right
- **WhatsApp**: Green button for direct chat
- **FAQ**: Searchable knowledge base
- **Contact**: Multiple contact methods

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)

## 📝 License

This project is proprietary software for SmileVista Dental.

## 👥 Contributors

- Development Team
- UI/UX Design
- Quality Assurance

---

**Built with ❤️ for SmileVista Dental**

*Ready for production deployment!* ✅
