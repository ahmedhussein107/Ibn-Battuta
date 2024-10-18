import Complaint from "../models/complaint.model.js";

export const createComplaint = async (req, res) => {
  const newComplaint = new Complaint(req.body);
  try {
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  const { id } = req.params;
  try {
    const complaint = await Complaint.findById(id);
    if (complaint) {
      res.status(200).json(complaint);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaintById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const complaint = await Complaint.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (complaint) {
      res.status(200).json(complaint);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComplaintById = async (req, res) => {
  const { id } = req.params;
  try {
    const complaint = await Complaint.findByIdAndDelete(id);
    if (complaint) {
      res.status(200).json({ message: "Complaint deleted successfully" });
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
