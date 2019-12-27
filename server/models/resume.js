const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ResumeSchema = new mongoose.Schema({
  id: {
    type: String,
    minlength: 1,
    trim: true,
    unique: true,
  },
  last_name: {
    type: String,
    minlength: 1,
    trim: true,
  },
  first_name: {
    type: String,
    minlength: 1,
    trim: true,
  },
  middle_name: {
    type: String,
    minlength: 1,
    trim: true,
  },
  age: {
    type: Number,
    min: 1,
  },
  birth_date: {
    type: String,
    minlength: 1,
    trim: true,
  },
  gender: {
    id: { type: String, enum: ['male', 'female'] },
    name: { type: String }
  },
  area: {
    url: { type: String },
    id: { type: String },
    name: { type: String }
  },
  metro: {
    lat: { type: Number },
    lng: { type: Number },
    order: { type: Number },
    id: { type: String },
    name: { type: String }
  },
  relocation: {
    type: {
      id: { type: String },
      name: { type: String }
    },
    area: [
      {
        url: { type: String },
        id: { type: String },
        name: { type: String }
      }
    ]
  },
  business_trip_readiness: {
    id: { type: String },
    name: { type: String }
  },
  contact: [
    mongoose.Schema({
      verified: { type: Boolean },
      comment: { type: String },
      type: {
        id: { type: String },
        name: { type: String }
      },
      preferred: { type: Boolean },
      value: {
        country: { type: String },
        city: { type: String },
        number: { type: String },
        formatted: { type: String }
      }
    }, { _id: false })
  ],
  site: [
    mongoose.Schema({
      type: {
        id: { type: String },
        name: { type: String }
      }
    }, { _id: false })
  ],
  title: { type: String },
  photo: {
    small: { type: String },
    medium: { type: String },
  },
  portfolio: [
    {
      small: { type: String },
      medium: { type: String },
      description: { type: String }
    }
  ],
  specialization: [
    {
      name: { type: String },
      profarea_name: { type: String },
    }
  ],
  salary: {
    amount: { type: String },
  },
  employments: [
    {
      name: { type: String }
    }
  ],
  schedules: [
    {
      name: { type: String }
    }
  ],
  education: {
    elementary: [
      {
        name: { type: String },
        year: { type: Number }
      }
    ],
    additional: [
      {
        name:{ type: String },
        organization: { type: String },
        result: { type: String },
        year: { type: Number }
      }
    ],
    attestation: [
      {
        name: { type: String },
        organization: { type: String },
        result: { type: String },
        year: { type: Number }
      }
    ],
    primary: [
      {
        name: { type: String },
        name_id: { type: Number },
        organization: { type: String },
        organization_id: { type: Number },
        result: { type: String },
        result_id: { type: String },
        year: { type: Number }
      }
    ],
    level: {
      id: { type: String },
      name: { type: String }
    }
  },
  language: [
    {
      id: { type: String },
      name: { type: String },
      level: {
        id: { type: String },
        name: { type: String }
      }
    }
  ],
  experience: [
    {
      company: { type: String },
      area: {
        name: { type: String }
      },
      industries: [
        {
          name: {type: String}
        }
      ],
      position: { type: String },
      start: { type: String },
      end: { type: String },
      interval: { type: String },
      description: { type: String },
    }
  ],
  total_experience: {
    months: { type: Number },
    total: { type: String }
  },
  skills: { type: String },
  skill_set: [
    String
  ],
  citizenship: [
    {
      url: { type: String },
      id: { type: String },
      name: { type: String },
    }
  ],
  work_ticket: [
    {
      url: { type: String },
      id: { type: String },
      name: { type: String },
    }
  ],
  travel_time: {
    id: { type: String },
    name: { type: String },
  },
  recommendation: [
    {
      name: { type: String },
      position: { type: String },
      organization: { type: String },
    }
  ],
  resume_locale: {
    id: { type: String },
    name: { type: String },
  },
  certificate: [
    {
      title: { type: String },
      achieved_at: { type: String },
      type: { type: String },
      owner: { type: String },
      url: { type: String },
    }
  ],
  alternate_url: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  download: {
    pdf: {
      url: { type: String },
    },
    rtf: {
      url: { type: String },
    }
  },
  has_vehicle: { type: Boolean },
  driver_license_types: [
    {
      id: { type: String },
    }
  ],
  hidden_fields: [
    {
      id: { type: String },
      name: { type: String },
    }
  ]
});

ResumeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Resume', ResumeSchema);
