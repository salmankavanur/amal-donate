// src/app/api/campaigns/published/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Campaign from '../../../models/Campaign';

export async function GET() {
  try {
    console.log('Fetching published campaigns...');
    await connectToDatabase();
    console.log('Database connected successfully');

    // Fetch campaigns with status: "active"
    const campaigns = await Campaign.find({ status: 'active' })
      .select('name type description goal currentAmount startDate endDate featuredImage featuredImageType') // Select only needed fields
      .lean(); // Convert to plain JS objects

    // Convert Buffer to base64 for images
    const campaignsWithImages = campaigns.map(campaign => {
      let imageUrl = null;
      if (campaign.featuredImage && campaign.featuredImageType) {
        imageUrl = `data:${campaign.featuredImageType};base64,${campaign.featuredImage.toString('base64')}`;
      }
      return {
        id: campaign._id.toString(),
        title: campaign.name,
        description: campaign.description,
        image: imageUrl,
        endDate: campaign.endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        goal: campaign.goal,
        raised: campaign.currentAmount || 0, // Default to 0 if not set
      };
    });

    console.log('Published campaigns fetched:', campaignsWithImages.length);
    return NextResponse.json(campaignsWithImages, { status: 200 });
  } catch (error) {
    console.error('Error fetching published campaigns:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaigns',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}