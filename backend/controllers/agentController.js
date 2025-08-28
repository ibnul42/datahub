const Agent = require('../models/Agent');
const { validationResult } = require('express-validator');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get agent by mobile
// @route   GET /api/agents/mobile/:mobile
// @access  Private
const getAgentByMobile = async (req, res) => {
  try {
    const agent = await Agent.findOne({ mobile: req.params.mobile });
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create agent
// @route   POST /api/agents
// @access  Private
const createAgent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const agent = await Agent.create(req.body);

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate mobile number' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private
const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload agent NID
// @route   POST /api/agents/:id/upload-nid
// @access  Private
const uploadAgentNID = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No NID file uploaded' });
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        'documentFiles.nid': req.file.filename,
        'documents.nid': true,
      },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      success: true,
      data: agent,
      message: 'NID uploaded successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload agent photo
// @route   POST /api/agents/:id/upload-photo
// @access  Private
const uploadAgentPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo file uploaded' });
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        'documentFiles.photo': req.file.filename,
        'documents.photo': true,
      },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      success: true,
      data: agent,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload agent documents (both NID and photo)
// @route   POST /api/agents/:id/upload-documents
// @access  Private
const uploadAgentDocuments = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const updates = {};
    if (req.files.nid) {
      updates['documentFiles.nid'] = req.files.nid[0].filename;
      updates['documents.nid'] = true;
    }
    if (req.files.photo) {
      updates['documentFiles.photo'] = req.files.photo[0].filename;
      updates['documents.photo'] = true;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid files uploaded' });
    }

    const agent = await Agent.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      success: true,
      data: agent,
      message: 'Documents uploaded successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAgents,
  getAgentByMobile,
  createAgent,
  updateAgent,
  uploadAgentNID, // Add new export
  uploadAgentPhoto, // Add new export
  uploadAgentDocuments,
  deleteAgent
};