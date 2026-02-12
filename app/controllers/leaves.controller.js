const express = require("express");
const apiRoutes = express.Router();
const Leaves = require("../models/leave.model");

module.exports = function (app) {

  // ✅ CREATE LEAVE
  apiRoutes.post("/createLeave", async (req, res) => {
    try {
      const {
        employeeName,
        leaveType,
        fromDate,
        toDate,
        reason,
        approvedBy
      } = req.body;

       const leaveId = "ENQ-" + Math.floor(1000 + Math.random() * 9000);


      const leave = await Leaves.create({
        leaveId,
        employeeName,
        leaveType,
        fromDate,
        toDate,
        reason,
        approvedBy
      });

      return res.status(201).json({
        message: "Leave applied successfully",
        data: leave
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ✅ GET ALL LEAVES
  apiRoutes.get("/getLeaves", async (req, res) => {
    try {
      const leaves = await Leaves.find({});

      return res.status(200).json({
        message: "Leaves fetched successfully",
        data: leaves
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ✅ GET LEAVE BY ID
  apiRoutes.get("/getLeave/:id", async (req, res) => {
    try {
      const leave = await Leaves.findById(req.params.id);

      if (!leave) {
        return res.status(404).json({
          message: "Leave not found"
        });
      }

      return res.status(200).json({
        data: leave
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ✅ UPDATE LEAVE (status / dates / reason)
  apiRoutes.post("/updateLeave", async (req, res) => {
    try {
      const {
        leaveId,
        status,
        leaveType,
        fromDate,
        toDate,
        reason,
        approvedBy
      } = req.body;

      const leave = await Leaves.findById(leaveId);

      if (!leave) {
        return res.status(404).json({
          message: "Leave not found"
        });
      }

      const updates = { status, leaveType, fromDate, toDate, reason,approvedBy };

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          leave[key] = updates[key];
        }
      });

      await leave.save();

      return res.status(200).json({
        message: "Leave updated successfully",
        data: leave
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ✅ DELETE LEAVE
  apiRoutes.post("/deleteLeave", async (req, res) => {
    try {
      const { leaveId } = req.body;

      const leave = await Leaves.findByIdAndDelete(leaveId);

      if (!leave) {
        return res.status(404).json({
          message: "Leave not found"
        });
      }

      return res.status(200).json({
        message: "Leave deleted successfully"
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.use("/", apiRoutes);
};
