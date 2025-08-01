# Stock Analytica - Equity Research Platform

A comprehensive equity research automation platform that transforms Excel stock lists into professional-grade equity research reports using advanced AI analysis.

## Features

### Core Functionality
- **Excel Stock List Processing**: Upload and parse Excel files containing stock information
- **AI-Powered Report Generation**: Generate institutional-grade equity research reports
- **Stock Selection & Configuration**: Choose specific stocks and customize analysis sections
- **Manual Stock Ranking System**: Rate stocks on a -5 to +5 scale with personal notes
- **Portfolio Management**: Track and manage your stock ratings and analysis history

### Earnings Analysis (New)
- **Earnings Calendar**: Track upcoming and released earnings with key metrics
- **Quarterly Analysis**: Analyze specific earnings releases and their market impact
- **Market Sentiment**: Monitor overall market sentiment and analyst activity
- **Real-time Updates**: Stay informed during earnings season with live data

### Professional Reports
- **Company Overview**: Business history, management changes, SWOT analysis
- **Sector Review**: Regulatory environment, industry trends, market dynamics
- **Valuation Analysis**: Price targets, peer comparison, key drivers
- **Sentiment Guidance**: Analyst revisions, consensus estimates
- **Investment Thesis**: Bull, bear, and base case scenarios with probabilities

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query, React Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd stock-analytica

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Layout)
│   └── ui/            # shadcn/ui components
├── pages/             # Main application pages
│   ├── Dashboard.tsx  # Main dashboard
│   ├── Portfolio.tsx  # Portfolio management
│   ├── StockAnalysis.tsx # Stock analysis interface
│   ├── EarningsAnalysis.tsx # Earnings analysis (new)
│   └── ResearchReport.tsx # Report viewer
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── data/              # Mock data and constants
```

## Usage

1. **Upload Stock List**: Use the dashboard to upload your Excel file containing stock data
2. **Select Stocks**: Choose specific stocks from your uploaded list for analysis
3. **Configure Analysis**: Select which sections to include in your research report
4. **Generate Reports**: Let AI create comprehensive equity research reports
5. **Rate Stocks**: Assign personal ratings and notes to track your analysis
6. **Monitor Earnings**: Use the new Earnings Analysis feature during earnings season

## Development

This project uses modern React patterns and best practices:

- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components and interactions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
