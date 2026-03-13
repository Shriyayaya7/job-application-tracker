import { Response } from 'express';
import JobApplication from '../models/JobApplication';
import { AuthRequest } from '../middleware/auth';

export const createJobApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      companyName,
      jobTitle,
      jobDescription,
      status,
      applicationDate,
      location,
      salary,
      jobUrl,
      notes,
      resumeId,
      coverLetterId,
    } = req.body;

    const jobApplication = new JobApplication({
      userId: req.user!._id,
      companyName,
      jobTitle,
      jobDescription,
      status,
      applicationDate,
      location,
      salary,
      jobUrl,
      notes,
      resumeId,
      coverLetterId,
    });

    await jobApplication.save();
    res.status(201).json(jobApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query: any = { userId: req.user!._id };
    if (status) {
      query.status = status;
    }

    const jobApplications = await JobApplication.find(query)
      .populate('resumeId', 'title')
      .populate('coverLetterId', 'title')
      .sort({ applicationDate: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await JobApplication.countDocuments(query);

    res.json({
      jobApplications,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getJobApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobApplication = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    })
      .populate('resumeId')
      .populate('coverLetterId');

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    res.json(jobApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateJobApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobApplication = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    res.json(jobApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteJobApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobApplication = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getJobAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const totalApplications = await JobApplication.countDocuments({ userId });
    
    const statusCounts = await JobApplication.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const monthlyApplications = await JobApplication.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$applicationDate' },
            month: { $month: '$applicationDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    const topCompanies = await JobApplication.aggregate([
      { $match: { userId } },
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalApplications,
      statusCounts,
      monthlyApplications,
      topCompanies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
