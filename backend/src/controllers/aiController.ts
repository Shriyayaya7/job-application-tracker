import { Response } from 'express';
import OpenAI from 'openai';
import Resume from '../models/Resume';
import { AuthRequest } from '../middleware/auth';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!openai) {
      res.status(500).json({ message: 'OpenAI API key not configured' });
      return;
    }
    
    const { resumeId } = req.params;
    
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const prompt = `
      Analyze this resume and provide detailed feedback:
      
      Resume Content:
      ${resume.content}
      
      Please provide:
      1. Overall score (1-10)
      2. Key strengths
      3. Areas for improvement
      4. Missing keywords that should be included
      5. Formatting suggestions
      6. Action items to improve the resume
      
      Format your response as JSON with the following structure:
      {
        "score": 8,
        "strengths": ["Strong technical skills", "Good experience"],
        "improvements": ["Add quantifiable achievements", "Improve formatting"],
        "missingKeywords": ["leadership", "project management"],
        "formattingSuggestions": ["Use bullet points consistently"],
        "actionItems": ["Add metrics to achievements", "Include summary section"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume reviewer. Provide detailed, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    resume.aiAnalysis = {
      score: analysis.score || 7,
      suggestions: analysis.strengths || [],
      improvements: analysis.improvements || [],
    };

    await resume.save();

    res.json({
      ...analysis,
      resumeId: resume._id,
    });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ message: 'AI analysis failed', error: (error as Error).message });
  }
};

export const generateInterviewQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!openai) {
      res.status(500).json({ message: 'OpenAI API key not configured' });
      return;
    }
    
    const { jobTitle, jobDescription, company } = req.body;

    const prompt = `
      Generate interview questions for the following position:
      
      Job Title: ${jobTitle}
      Company: ${company || 'Not specified'}
      Job Description: ${jobDescription || 'Not provided'}
      
      Please generate:
      1. 5 behavioral questions
      2. 5 technical questions (if applicable)
      3. 3 situational questions
      4. 2 questions about the candidate's interest in this role
      5. 3 questions the candidate should ask the interviewer
      
      Format your response as JSON:
      {
        "behavioral": ["question1", "question2", ...],
        "technical": ["question1", "question2", ...],
        "situational": ["question1", "question2", ...],
        "interest": ["question1", "question2", ...],
        "candidateQuestions": ["question1", "question2", ...]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an experienced interviewer. Generate relevant and thoughtful interview questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const questions = JSON.parse(completion.choices[0].message.content || '{}');

    res.json(questions);
  } catch (error) {
    console.error('Question Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate questions', error: (error as Error).message });
  }
};

export const improveResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!openai) {
      res.status(500).json({ message: 'OpenAI API key not configured' });
      return;
    }
    
    const { resumeId, targetJob } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const prompt = `
      Improve this resume for the following target job:
      
      Current Resume:
      ${resume.content}
      
      Target Job: ${targetJob}
      
      Please provide:
      1. An improved version of the resume content
      2. Specific changes made and why
      3. Keywords that were added
      4. Suggestions for quantifying achievements
      
      Format your response as JSON:
      {
        "improvedContent": "improved resume text",
        "changes": ["change1", "change2", ...],
        "addedKeywords": ["keyword1", "keyword2", ...],
        "quantificationSuggestions": ["suggestion1", "suggestion2", ...]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Improve resumes to match specific job descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const improvement = JSON.parse(completion.choices[0].message.content || '{}');

    res.json(improvement);
  } catch (error) {
    console.error('Resume Improvement Error:', error);
    res.status(500).json({ message: 'Failed to improve resume', error: (error as Error).message });
  }
};

export const extractKeywords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!openai) {
      res.status(500).json({ message: 'OpenAI API key not configured' });
      return;
    }
    
    const { text } = req.body;

    const prompt = `
      Extract important keywords from the following text that would be valuable for a job search:
      
      Text: ${text}
      
      Please extract:
      1. Technical skills
      2. Soft skills
      3. Industry terms
      4. Action verbs
      5. Certifications or qualifications
      
      Format your response as JSON:
      {
        "technicalSkills": ["skill1", "skill2", ...],
        "softSkills": ["skill1", "skill2", ...],
        "industryTerms": ["term1", "term2", ...],
        "actionVerbs": ["verb1", "verb2", ...],
        "certifications": ["cert1", "cert2", ...]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at identifying keywords for job applications and resumes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const keywords = JSON.parse(completion.choices[0].message.content || '{}');

    res.json(keywords);
  } catch (error) {
    console.error('Keyword Extraction Error:', error);
    res.status(500).json({ message: 'Failed to extract keywords', error: (error as Error).message });
  }
};
