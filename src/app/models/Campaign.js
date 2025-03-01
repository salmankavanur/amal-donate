// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ],
    trim: true,
    maxlength: [100, ]
  },
  type: {
    type: String,
    required: [true, ],
    enum: ['fundraising', 'building', 'orphan-care', 'education', 'emergency-relief', 'zakat']
  },
  goal: {
    type: Number,
    required: [true, ],
    min: [1, 'Goal must be at least 1']
  },
  description: {
    type: String,
    required: [true, ],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, ]
  },
  endDate: {
    type: Date,
    required: [true, ],
    validate: {
      validator: function(value) {
        return this.startDate < value;
      },
      message: 'End date must be after start date'
    }
  },
  targetAudience: {
    type: String,
    trim: true,
    default: 'General'
  },
  featuredImage: {
    type: Buffer, // Store image as binary data
    default: null
  },
  featuredImageType: { // Store the MIME type (e.g., 'image/jpeg')
    type: String,
    default: null
  },
  allowRecurringDonations: {
    type: Boolean,
    default: false
  },
  enableEmailReminders: {
    type: Boolean,
    default: true
  },
  showProgressBar: {
    type: Boolean,
    default: true
  },
  sendThankYouMessages: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

campaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export default Campaign;