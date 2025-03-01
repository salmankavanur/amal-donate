// src/app/api/campaigns/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Campaign from '../../../models/Campaign';

export async function GET(req, { params }) {
  try {
    // console.log(`Fetching campaign with ID: ${params.id}`);
    await connectToDatabase();

    const campaign = await Campaign.findById(params.id).lean();
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    let imageUrl = null;
    if (campaign.featuredImage && campaign.featuredImageType) {
      imageUrl = `data:${campaign.featuredImageType};base64,${campaign.featuredImage.toString('base64')}`;
    }

    const campaignData = {
      id: campaign._id.toString(),
      title: campaign.name,
      description: campaign.description,
      image: imageUrl,
      endDate: campaign.endDate.toISOString().split('T')[0],
      goal: campaign.goal,
      raised: campaign.currentAmount || 0,
    };

    console.log('Campaign fetched:', campaignData);
    return NextResponse.json(campaignData, { status: 200 });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign', details: error.message },
      { status: 500 }
    );
  }
}