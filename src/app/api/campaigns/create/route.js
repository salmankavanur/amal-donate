// src/app/api/campaigns/create/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Campaign from '../../../models/Campaign';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    console.log('Starting campaign creation...');
    
    await connectToDatabase();
    console.log('Database connected successfully');

    // Get session (authentication check)
    const session = await getServerSession();
    console.log('Session:', session);

    // Define a fallback user ID for testing (replace with a real User ID from your database)
    const fallbackUserId = '65844ea588d90515b80e0dfb'; // Replace with a valid ObjectId from your 'users' collection
    console.log('Fallback User ID for testing:', fallbackUserId);

    if (!session || !session.user || !session.user.id) {
      console.warn('No valid session found, using fallback user ID for testing');
      // In production, uncomment the following to enforce authentication:
      // return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // Handle form data
    const formData = await req.formData();
    console.log('Received FormData:', Array.from(formData.entries()).map(([k, v]) => `${k}: ${v}`));

    // Extract fields
    const fields = {
      name: formData.get('name'),
      type: formData.get('type'),
      goal: formData.get('goal'),
      description: formData.get('description'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      targetAudience: formData.get('targetAudience'),
      allowRecurringDonations: formData.get('allowRecurringDonations') === 'true',
      enableEmailReminders: formData.get('enableEmailReminders') === 'true',
      showProgressBar: formData.get('showProgressBar') === 'true',
      sendThankYouMessages: formData.get('sendThankYouMessages') === 'true',
      notes: formData.get('notes'),
    };

    console.log('Extracted Fields:', fields);

    // Validate required fields
    if (!fields.name || !fields.type || !fields.goal || !fields.description || !fields.startDate || !fields.endDate) {
      console.error('Validation failed - Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert and validate goal
    fields.goal = parseInt(fields.goal, 10);
    if (isNaN(fields.goal) || fields.goal < 1) {
      console.error('Validation failed - Invalid goal value');
      return NextResponse.json(
        { error: 'Invalid goal value' },
        { status: 400 }
      );
    }

    // Validate dates
    fields.startDate = new Date(fields.startDate);
    fields.endDate = new Date(fields.endDate);
    if (fields.startDate >= fields.endDate) {
      console.error('Validation failed - End date must be after start date');
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Handle image upload to MongoDB
    const featuredImage = formData.get('featuredImage');
    let imageBuffer = null;
    let imageType = null;

    if (featuredImage && featuredImage instanceof Blob) {
      console.log('Processing image upload...');
      imageBuffer = Buffer.from(await featuredImage.arrayBuffer());
      imageType = featuredImage.type;
      console.log('Image processed, size:', imageBuffer.length);
    }

    // Create campaign object
    const campaign = new Campaign({
      ...fields,
      featuredImage: imageBuffer,
      featuredImageType: imageType,
      createdBy: session?.user?.id || fallbackUserId, // Use session ID if available, otherwise fallback
    });

    console.log('Saving campaign to database...');
    await campaign.save();
    console.log('Campaign saved successfully:', campaign._id);

    return NextResponse.json(
      {
        message: 'Campaign created successfully',
        campaignId: campaign._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating campaign:', error, error.stack);
    return NextResponse.json(
      {
        error: 'Failed to create campaign',
        details: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};