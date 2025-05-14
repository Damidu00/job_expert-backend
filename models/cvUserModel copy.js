import mongoose from "mongoose";

const cvuserSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cvId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default:
      "https://www.transparentpng.com/thumb/user/blak-frame-user-profile-png-icon--cupR3D.png",
  },
  linkedinURL: {
    type: String,
    default: "",
    trim: true,
  },
  githubURL: {
    type: String,
    default: "",
    trim: true,
  },
  Address: {
    type: String,
    required: true,
    trim: true,
  },
  shortBio: {
    type: String,
    required: true,
    trim: true,
  },

  skills: {
    type: [
      {
        category: { type: String, required: true },
        items: { type: [String], required: true },
      },
    ],
    default: [],
  },

  certificates: {
    type: [
      {
        instituteName: { type: String, required: true },
        certificateName: { type: String, required: true },
        Link: { type: String },
      },
    ],
    default: [],
  },
  referees: [
    {
      refType: { type: String, enum: ["male", "female"], required: true },
      FirstName: { type: String, required: true },
      LastName: { type: String, required: true },
      position: { type: String, required: true },
      workingPlace: { type: String, required: true },
      location: { type: String, required: true },
      phone: { type: String, required: true },
    },
  ],

  details: [
    {
      eduLevel: { type: String, required: true },
      school: { type: String, required: true },
      degree: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String },
    },
  ],

  experiences: [
    {
      company: { type: String, required: true, trim: true },
      jobTitle: { type: String, required: true, trim: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String },
    },
  ],

  projects: [
    {
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      githubLink: { type: String, required: true, trim: true },
      liveDemo: { type: String, trim: true },
      techStack: [{ type: String, trim: true }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const cvUsers = mongoose.model("cvuser", cvuserSchema);
export default cvUsers;
