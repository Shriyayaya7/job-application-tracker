import { Response } from 'express';
import nodemailer from 'nodemailer';
import JobApplication from '../models/JobApplication';
import { AuthRequest } from '../middleware/auth';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendFollowUpReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId, reminderDate, message } = req.body;

    const jobApplication = await JobApplication.findOne({
      _id: jobId,
      userId: req.user!._id,
    });

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user!.email,
      subject: `Follow-up Reminder: ${jobApplication.jobTitle} at ${jobApplication.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Follow-up Reminder</h2>
          <p>Hi ${req.user!.name},</p>
          <p>This is a reminder to follow up on your application for:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #111827;">${jobApplication.jobTitle}</h3>
            <p style="margin: 5px 0; color: #6b7280;">${jobApplication.companyName}</p>
            <p style="margin: 5px 0; color: #6b7280;">Applied: ${new Date(jobApplication.applicationDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #6b7280;">Status: ${jobApplication.status}</p>
          </div>
          ${message ? `<p><strong>Personal Note:</strong> ${message}</p>` : ''}
          <p>Suggested follow-up actions:</p>
          <ul style="color: #4b5563;">
            <li>Send a polite email to the hiring manager</li>
            <li>Connect with the recruiter on LinkedIn</li>
            <li>Check if there are any updates on the job posting</li>
          </ul>
          <p style="margin-top: 30px;">Good luck!</p>
          <p>Best regards,<br>Job Application Tracker</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Follow-up reminder sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send reminder', error: (error as Error).message });
  }
};

export const scheduleFollowUp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId, followUpDate, reminderType } = req.body;

    const jobApplication = await JobApplication.findOneAndUpdate(
      { _id: jobId, userId: req.user!._id },
      { 
        $set: {
          followUpDate,
          reminderType,
        }
      },
      { new: true }
    );

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    res.json({ message: 'Follow-up scheduled successfully', jobApplication });
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule follow-up', error: (error as Error).message });
  }
};

export const getUpcomingReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingReminders = await JobApplication.find({
      userId: req.user!._id,
      followUpDate: {
        $gte: today,
        $lte: nextWeek,
      },
    }).sort({ followUpDate: 1 });

    res.json(upcomingReminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error: (error as Error).message });
  }
};

export const sendWeeklyDigest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentApplications = await JobApplication.find({
      userId,
      applicationDate: { $gte: oneWeekAgo },
    }).sort({ applicationDate: -1 });

    const statusCounts = await JobApplication.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const totalApplications = await JobApplication.countDocuments({ userId });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user!.email,
      subject: 'Weekly Job Application Digest',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Weekly Job Application Digest</h2>
          <p>Hi ${req.user!.name},</p>
          <p>Here's your weekly job application summary:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #111827;">📊 Overview</h3>
            <p style="margin: 5px 0;">Total Applications: ${totalApplications}</p>
            <p style="margin: 5px 0;">New This Week: ${recentApplications.length}</p>
          </div>

          ${recentApplications.length > 0 ? `
            <h3 style="color: #111827;">📋 Recent Applications</h3>
            ${recentApplications.map(app => `
              <div style="background: white; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px;">
                <h4 style="margin: 0 0 5px 0; color: #111827;">${app.jobTitle}</h4>
                <p style="margin: 3px 0; color: #6b7280;">${app.companyName}</p>
                <p style="margin: 3px 0; color: #6b7280;">Applied: ${new Date(app.applicationDate).toLocaleDateString()}</p>
                <p style="margin: 3px 0;">
                  <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                    ${app.status}
                  </span>
                </p>
              </div>
            `).join('')}
          ` : '<p>No new applications this week.</p>'}

          <div style="margin-top: 30px;">
            <h3 style="color: #111827;">📈 Status Breakdown</h3>
            ${statusCounts.map(stat => `
              <p style="margin: 5px 0;">
                <strong>${stat._id}:</strong> ${stat.count}
              </p>
            `).join('')}
          </div>

          <p style="margin-top: 30px;">Keep up the great work!</p>
          <p>Best regards,<br>Job Application Tracker</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Weekly digest sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send digest', error: (error as Error).message });
  }
};
