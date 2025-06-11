import { Controller, Post, Body } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const knowledgeBase = [
  // Billing
  {
    id: 1,
    title: 'How to fix payment failures',
    summary: 'Step-by-step guide to resolve billing issues.',
    tags: ['Billing', 'Payment'],
  },
  {
    id: 2,
    title: 'Understanding your billing statement',
    summary: 'Learn how to read and understand your billing statement.',
    tags: ['Billing'],
  },
  {
    id: 3,
    title: 'Requesting a refund',
    summary: 'Guidelines on how to request a refund for incorrect charges.',
    tags: ['Billing', 'Refund'],
  },

  // Technical
  {
    id: 4,
    title: 'App crash troubleshooting',
    summary: 'Tips to resolve app crashes and freezing issues.',
    tags: ['Technical', 'Crash'],
  },
  {
    id: 5,
    title: 'Resetting your password',
    summary: 'How to reset your password if you can’t log in.',
    tags: ['Technical', 'Login'],
  },
  {
    id: 6,
    title: 'Clearing app cache',
    summary: 'Steps to clear your app cache and improve performance.',
    tags: ['Technical', 'Performance'],
  },

  // Bug Reports
  {
    id: 7,
    title: 'Reporting a bug',
    summary: 'Steps to submit a bug report to our support team.',
    tags: ['Bug Report'],
  },
  {
    id: 8,
    title: 'Known issues list',
    summary: 'Check the current list of known issues and workarounds.',
    tags: ['Bug Report'],
  },

  // Feature Requests
  {
    id: 9,
    title: 'Requesting new features',
    summary: 'How to submit a feature request for our product team.',
    tags: ['Feature Request'],
  },
  {
    id: 10,
    title: 'Feature request prioritization',
    summary: 'Learn how we prioritize feature requests.',
    tags: ['Feature Request'],
  },

  // General / Other
  {
    id: 11,
    title: 'Contacting customer support',
    summary: 'How to reach our customer support team for help.',
    tags: ['Other'],
  },
  {
    id: 12,
    title: 'Account management overview',
    summary: 'General guide to managing your account settings.',
    tags: ['Other'],
  },
];

const routingMap: Record<string, string> = {
  Billing: 'Billing Support Team',
  Technical: 'Technical Support Team',
  'Bug Report': 'Bug Triage Team',
  'Feature Request': 'Product Management Team',
  Other: 'General Support Team',
};

interface ClassificationResult {
  category: string;
  urgency: string;
  confidence: number;
  reasoning: string;
}

@Controller('ticket')
export class TicketController {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @Post('classify')
  async classifyTicket(@Body() body: { text: string }) {
    const { text } = body;

    const prompt = `
You are a support ticket classifier. Analyze the following ticket and return JSON with:
- category: One of [Billing, Technical, Bug Report, Feature Request, Other]
- urgency: One of [Low, Medium, High]
- confidence: A float between 0 and 1 representing confidence in the classification.
- reasoning: A single short sentence explaining the classification.
Here is the ticket text:
"""
${text}
"""
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [{ role: 'user', content: prompt }],
      });

      // Try to parse JSON from the response
      const reply = completion.choices[0].message.content || '';
      const jsonStart = reply.indexOf('{');
      const jsonEnd = reply.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('JSON not found in the model response');
      }
      const jsonString: string = reply.substring(jsonStart, jsonEnd + 1);
      const result = JSON.parse(jsonString) as ClassificationResult;

      return result;
    } catch (error) {
      console.error('Error classifying ticket:', error);
      throw error;
    }
  }

  @Post('solutions')
  getSolutions(@Body() body: { classification: ClassificationResult }) {
    const { category } = body.classification;

    const solutions = knowledgeBase.filter((article) =>
      article.tags.includes(category),
    );

    // Return top 2 solutions (or fewer if not enough)
    return solutions.slice(0, 2);
  }

  @Post('route')
  routeTicket(@Body() body: { classification: ClassificationResult }) {
    const { category, confidence } = body.classification;

    if (confidence < 0.6) {
      return {
        assignedTeam: 'Manual Review Queue',
        status: 'Low confidence – needs human review',
      };
    }

    const assignedTeam: string = routingMap[category] || 'General Support Team';
    console.log(`Routing ticket to: ${assignedTeam}`);
    return { assignedTeam, status: 'Ticket routed successfully' };
  }
}
